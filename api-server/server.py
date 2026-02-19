import os
import requests
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

MINING_DUTCH_KEY = os.environ.get("MINING_DUTCH_KEY", "").strip()
WHATSONCHAIN_KEY = os.environ.get("WHATSONCHAIN_KEY", "").strip()

@app.route('/api/stats', methods=['GET'])
def get_stats():
    coin = request.args.get('coin', 'BTC')
    headers = {'User-Agent': 'SoloBlock-Proxy/1.0'}
    
    try:
        if coin in ['BTC', 'BCH']:
            slug = "bitcoin" if coin == 'BTC' else "bitcoin-cash"
            r = requests.get(f"https://api.blockchair.com/{slug}/stats", headers=headers).json()
            return jsonify({
                "hash": r['data']['hashrate_24h'], 
                "diff": r['data']['difficulty'], 
                "blocks": 144
            })

        elif coin == 'BSV':
            bsv_headers = headers.copy()
            if WHATSONCHAIN_API_KEY:
                bsv_headers['woc-api-key'] = WHATSONCHAIN_API_KEY
            
            r = requests.get("https://api.whatsonchain.com/v1/bsv/main/chain/info", headers=bsv_headers).json()
            return jsonify({
                "hash": float(r['hashrate']), 
                "diff": float(r['difficulty']), 
                "blocks": 144
            })
        elif coin == 'BC2':
            r = requests.get("https://bc2explorer.com/api/v1/live-diff", headers=headers).json()
            diff = float(r['difficulty'])
            return jsonify({
                "hash": (diff * 4294967296) / 600, 
                "diff": diff, 
                "blocks": 144
            })

        elif coin in ['DGB', 'FB', 'PPC']:
            pool_map = {'DGB': 'digibyte_sha256', 'FB': 'fractalbitcoin', 'PPC': 'peercoin'}
            
            if not MINING_DUTCH_KEY:
                return jsonify({"error": "API Key missing"}), 500

            url = f"https://www.mining-dutch.nl/pools/{pool_map[coin]}.php?page=api&action=getdashboarddata&api_key={MINING_DUTCH_KEY}"
            resp = requests.get(url, headers=headers)
            r = resp.json()

            try:
                if 'getdashboarddata' in r:
                    network_data = r['getdashboarddata']['data']['network']
                else:
                    network_data = r.get('network', r.get('data', {}).get('network'))

                if not network_data or 'difficulty' not in network_data:
                    raise KeyError("Difficulty field missing")

                diff = float(network_data['difficulty'])
            
            except Exception as e:
                logger.error(f"MD Parse Error for {coin}: {str(e)} | Response keys: {list(r.keys())}")
                return jsonify({"error": "Pool Data Parse Error"}), 502

            blocks = 144
            if coin == 'DGB': blocks = 5760
            elif coin == 'FB': blocks = 2880

            target_time = 86400 / blocks
            calc_hash = (diff * 4294967296) / target_time

            return jsonify({
                "hash": calc_hash, 
                "diff": diff, 
                "blocks": blocks
            })

    except Exception as e:
        logger.exception("CRITICAL ERROR")
        return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Unknown Coin"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

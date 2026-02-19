// Hardware Database
const HARDWARE = [
    { name: "NerdOctaxe TITAN", th: 12, w: 240 },
    { name: "NerdOctaxe", th: 9.6, w: 160 },
    { name: "NerdQaxe++ Rev 6.1 Hydro", th: 6, w: 100 },
    { name: "NerdQaxe++ Hydro", th: 4.8, w: 78 },
    { name: "NerdQaxe++", th: 4.8, w: 81 },
    { name: "Bitaxe Supra Hex 703", th: 4.2, w: 90 },
    { name: "Bitaxe Gamma GT 801", th: 2.15, w: 38 },
    { name: "Bitaxe Gamma 601", th: 1.2, w: 18 },
    { name: "Bitaxe Supra 403", th: 0.7, w: 15 }
];

function init() {
    const c = document.getElementById('hwContainer');
    HARDWARE.forEach((h, i) => {
        c.innerHTML += `
            <div class="hw-item">
                <div class="hw-info">
                    <b>${h.name}</b>
                    <span>${h.th} TH/s | ${h.w}W</span>
                </div>
                <div class="qty-ctrl">
                    <button class="btn-q" onclick="modQty(${i}, -1)">-</button>
                    <input id="q-${i}" class="val-q" value="0" readonly>
                    <button class="btn-q" onclick="modQty(${i}, 1)">+</button>
                </div>
            </div>
        `;
    });
    fetchPowerball();
}

function modQty(i, d) {
    const el = document.getElementById(`q-${i}`);
    el.value = Math.max(0, parseInt(el.value) + d);
}

// Fetch Powerball Jackpot
async function fetchPowerball() {
    const el = document.getElementById('pbJackpot');
    try {
        const res = await fetch('https://tsb-api.onrender.com/powerball');
        const data = await res.json();
        
        const amount = data.jackpot; 
        if(amount) {
            el.innerText = amount; 
        } else {
            el.innerText = "$86M (Est.)"; 
        }
    } catch(e) {
        el.innerText = "$86M (Est.)"; 
    }
}

async function calculate() {
    const coin = document.getElementById('coin').value;
    const kwhPrice = parseFloat(document.getElementById('kwhCost').value) || 0;
    const statusBox = document.getElementById('statusBox');

    // Calculating total hash power and wattage
    let totalTh = 0;
    let totalW = 0;

    HARDWARE.forEach((h, i) => {
        const qty = parseInt(document.getElementById(`q-${i}`).value) || 0;
        totalTh += (qty * h.th);
        totalW += (qty * h.w);
    });

    document.getElementById('farmPower').innerText = totalTh.toFixed(2) + " TH/s";
    document.getElementById('farmWatts').innerText = totalW + " W";

    // Cost Calc
    const dailyKwh = (totalW * 24) / 1000;
    const costDay = dailyKwh * kwhPrice;
    document.getElementById('dailyCost').innerText = "$" + costDay.toFixed(2);

    const monthKwh = (totalW * 720) / 1000;
    const costMonth = monthKwh * kwhPrice;
    document.getElementById('monthlyCost').innerText = "$" + costMonth.toFixed(2);

    const yearKwh = (totalW * 8640) / 1000;
    const costYear = yearKwh * kwhPrice;
    document.getElementById('yearlyCost').innerText = "$" + costYear.toFixed(2);
    
    // update powerball comparison
    document.getElementById('miningCostComp').innerText = "$" + costYear.toFixed(2);

    // grab api data and calculate odds
    statusBox.innerText = "Connecting to API...";
    statusBox.className = "status-bar loading";

    try {
        const res = await fetch(`/api/stats?coin=${coin}`);

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();

        if(data.error) throw new Error(data.error);

        const netHashH = data.hash; // in H/s
        const netHashTH = netHashH / 1e12;
        const diff = data.diff;
        const blocksDay = data.blocks;

        // net hash
        let dispHash = netHashTH > 1000000 ? (netHashTH/1e6).toFixed(2) + " EH/s" :
                       netHashTH > 1000 ? (netHashTH/1e3).toFixed(2) + " PH/s" :
                       netHashTH.toFixed(2) + " TH/s";

        document.getElementById('netHash').innerText = dispHash;
        document.getElementById('netDiff').innerText = Math.round(diff).toLocaleString();

        // probability calculations
        if(totalTh === 0) {
            statusBox.innerText = "";
            return;
        }

        const probPerBlock = (totalTh * 1e12) / netHashH; 
        const winsPerDay = probPerBlock * blocksDay;

        // formatting helpers
        const fmt = (wins) => {
            if(wins >= 1) return '<span class="guaranteed">GUARANTEED</span>';
            if(wins <= 0) return "-";
            
            const oneIn = 1 / wins;
            if(oneIn >= 1e9) return "1 in " + (oneIn/1e9).toFixed(1) + "B";
            if(oneIn >= 1e6) return "1 in " + (oneIn/1e6).toFixed(1) + "M";
            return "1 in " + Math.round(oneIn).toLocaleString();
        };
        
        const getOddsNum = (wins) => {
            if(wins >= 1) return 1;
            return Math.round(1 / wins);
        }

        document.getElementById('oddsDaily').innerHTML = fmt(winsPerDay);
        document.getElementById('oddsMonthly').innerHTML = fmt(winsPerDay * 30.4);
        document.getElementById('oddsYearly').innerHTML = fmt(winsPerDay * 365);
        
        // update powerball odds
        const yearlyOdds = getOddsNum(winsPerDay * 365);

        const miningCompEl = document.getElementById('miningOddsComp');
        if(yearlyOdds === 1) {
             miningCompEl.innerHTML = '<span class="guaranteed">Guaranteed Win</span>';
        } else {
             miningCompEl.innerText = "1 in " + yearlyOdds.toLocaleString();
        }

        statusBox.innerText = "";
        statusBox.className = "status-bar";

    } catch (e) {
        console.error(e);
        statusBox.innerText = "Error: " + e.message;
        statusBox.className = "status-bar err";
    }
}

window.onload = init;

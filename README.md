# Open Axe Project

This repository holds the website for the **Open Axe Project**, a community effort dedicated to
> **Open Source Knowledge for Open Source Hardware.**

The site currently includes a basic web frontend along with an API server used to power the calculator
feature. Additional pages and services will be added as the project grows.

## Structure

The web site root:
```
app.js
humans.txt
index.html
robots.txt
styles.css

calculator/
    app.js
    index.html
    styles.css
```

The API server for the calculator:
```
api-server/
    Dockerfile
    docker-compose.yml
    requirements.txt
    server.py
    .env
```

### Root
- `index.html`, `styles.css`, and `app.js` form the frontend of the main web project.
- `humans.txt`/`robots.txt` for site metadata.

### api-server

#### NOTE: This should not be left in the web root. This was added to this repository as it runs the API backend for the calculator. We could call everything in the webpage through javascript, but figured this would be easier to add coins to as we progress.

Contains a simple Python API service.
- `server.py` is the main application.
- `requirements.txt` lists Python dependencies.
- `Dockerfile` and `docker-compose.yml` for containerization.
- `.env` for environment variables.
- `.env` should look like this:
```
MINING_DUTCH_KEY = md#############
WHATSONCHAIN_KEY = mainnet_#######
```

### calculator
A standalone calculator.

## Getting Started

### Prerequisites
- Docker & Docker Compose (for API server)
- Python 3 (for running the API directly)

### Running the API

Move the api-server out of the repo directory if you aren't developing. From `api-server` folder:

```sh
# install dependencies
pip install -r requirements.txt

# run server
python server.py
```

Or with Docker:

```sh
docker-compose up --build
```

### Frontend
Open `index.html` in your browser (root or `calculator` directory) to view the respective pages.

## Environment Variables
The API server uses `.env` to store keys like `MINING_DUTCH_KEY` and `WHATSONCHAIN_API_KEY`.

## License
Licensed under the [MIT License](LICENSE.md).

## Support the Project

BTC: 
bc1qfcglqfnfquzclycmzlz3hq02l8cr5fe2vnmc8u

BCH: 
bitcoincash:qpve27m6cqw8nsz67kylmrg6g2t6favfrskk5ea2pn

DGB: 
DKARCJnsfKpUcSpyH9jDRCZQhiUAEZMwCm
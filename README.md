# Open Axe Project

This repository holds the website for the **Open Axe Project**, a community effort dedicated to
> **Open Source Knowledge for Open Source Hardware.**

The site currently includes a basic web frontend along with an API server used to power the calculator
feature. Additional pages and services will be added as the project grows.

## Structure

```
app.js
humans.txt
index.html
robots.txt
styles.css

api-server/
    Dockerfile
    docker-compose.yml
    requirements.txt
    server.py
    .env

calculator/
    app.js
    index.html
    styles.css
```

### Root
- `index.html`, `styles.css`, and `app.js` form the frontend of the main web project.
- `humans.txt`/`robots.txt` for site metadata.

### api-server
Contains a simple Python API service.
- `server.py` is the main application.
- `requirements.txt` lists Python dependencies.
- `Dockerfile` and `docker-compose.yml` for containerization.
- `.env` for environment variables.

### calculator
A standalone calculator web demo.

## Getting Started

### Prerequisites
- Docker & Docker Compose (for API server)
- Python 3 (for running the API directly)

### Running the API

From `api-server` folder:

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
Specify license here.

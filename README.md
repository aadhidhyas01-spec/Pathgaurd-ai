# Google Cloud Tech Summit 2026 — Conference Website

A Flask-based conference website prototype for a one-day technical summit. It presents a schedule, speaker directory and session information, with search and filtering for attendees.

> The repository retains an older name, `Pathgaurd-ai`; the implementation in this repository is a conference website, not a security product.

## Features

- Conference landing page and day schedule.
- Eight demo technical sessions covering AI/ML, cloud infrastructure and security topics.
- Speaker cards with roles, company details and profile links.
- Search by session title, speaker or topic.
- Filter by session category and speaker.
- Timeline and card presentation modes.
- Session detail API:
  - `GET /api/talks?q=...`
  - `GET /api/talk/<talk_id>`

## Technology

- Python 3.8+
- Flask
- HTML, CSS and JavaScript
- Python `unittest`

## Run locally

```bash
python -m venv .venv
# Windows:
.venv\\Scripts\\activate
# macOS / Linux:
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Run tests

```bash
python -m unittest discover -s tests -v
```

## Project layout

```text
app.py                  Flask routes and JSON API
data.py                 Demo conference, sessions and speaker data
templates/index.html    Main page template
static/css/style.css    Responsive page styling
static/js/main.js       Search, filters, modals and view controls
tests/test_app.py       Application and data tests
```

## Notes

The session and speaker data is demonstration content. Confirm event dates, venue, speaker identities and links before publishing this as a real event website. The Flask development server is for local testing; use a production WSGI server when deploying.

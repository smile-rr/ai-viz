# Hosting & CI/CD Setup Guide

## Architecture Overview

- **Data Pipeline**: GitHub Actions runs daily to collect financial data
- **Frontend**: Next.js static site deployed to Cloudflare Pages
- **Database**: Turso (libSQL) for structured data storage
- **Flow**: Data pipeline commits JSON files → push triggers Cloudflare Pages rebuild

## Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** in the GitHub repo and add:

| Secret | Description |
|--------|-------------|
| `TUSHARE_TOKEN` | Tushare API token for Chinese market data |
| `TURSO_DATABASE_URL` | Turso database URL (e.g., `libsql://db-name-org.turso.io`) |
| `TURSO_AUTH_TOKEN` | Turso authentication token |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with "Cloudflare Pages: Edit" permission |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID (found in dashboard URL or sidebar) |

## Cloudflare Pages Setup (One-Time)

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Workers & Pages → Create → Pages**
3. Choose **Direct Upload** (we deploy via GitHub Actions, not Cloudflare's Git integration)
4. Set the project name to `ai-viz`
5. Do an initial upload with any placeholder file to create the project
6. Create an API token at **My Profile → API Tokens → Create Token**:
   - Use the "Cloudflare Pages: Edit" template
   - Scope it to the correct account
7. Add the token and account ID as GitHub Secrets (see table above)

## How the Daily Update Flow Works

1. **Schedule**: The `daily-data.yml` workflow runs at UTC 10:00 on weekdays (Beijing 18:00, after A-share market close)
2. **Collect**: The Python pipeline fetches data from AKShare, yfinance, and Tushare
3. **Aggregate**: Data is aggregated into JSON files under `data/aggregated/`
4. **Commit**: The workflow copies JSON to `frontend/public/data/` and commits the changes
5. **Deploy**: The push to `main` triggers `deploy.yml`, which builds the Next.js static site and deploys to Cloudflare Pages

## Manual Data Refresh

To manually trigger a data refresh:

1. Go to the GitHub repo → **Actions** tab
2. Select **Daily Data Pipeline** from the left sidebar
3. Click **Run workflow** → **Run workflow**

This will run the pipeline immediately, commit new data, and trigger a frontend deployment.

## Manual Frontend Deploy

If you need to redeploy the frontend without a data update:

1. Go to **Actions** → **Deploy Frontend to Cloudflare Pages**
2. Or push any change to files under `frontend/` on the `main` branch

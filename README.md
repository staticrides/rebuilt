# Rebuilt

A small, installable Roblox username lookup web app. It serves a responsive browser UI and a JSON API from one Express process.

## Run locally

Requirements: Node.js 18 or newer.

1. Download this repository as a ZIP from GitHub (`Code` → `Download ZIP`) and extract it, or use GitHub's web editor to download the project files.
2. Open a terminal in the extracted `rebuilt` folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and add a Roblox API key if you have one. The app does not require a key for the local demo mode.
5. Run `npm start`.
6. Visit http://localhost:3000.

The API health check is at `/health`; user lookup is at `/api/user/<username>`.

## Configuration

- `PORT` (optional): listening port, defaults to `3000`.
- `API_KEY` (optional): key sent as `x-api-key` when requesting the Roblox user endpoint. Keep this secret and only put it in your local `.env`, never in frontend code or a committed file.

When `API_KEY` is not set, lookups return clearly marked local demo data. Demo mode is for checking the interface only; it is not live Roblox account data.

## Notes

The original source repository contains obfuscated/incomplete prototype files and hard-coded private-network script references. This rebuilt project is an independent, clean implementation of the simple username lookup UI rather than executing the old obfuscated payloads.

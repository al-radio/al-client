# AL Client

The client for AL Radio.

## Setup Client

- `npm i`
- Populate `NEXT_PUBLIC_API_URL` in `.env.local` to the local server API.
- Populate `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` in `.env.local` to your Spotify App client ID (only required to develop oauth)
- Populate `NEXT_PUBLIC_LASTFM_API_KEY` in `.env.local` to your LastFM API Key (only required to develop oauth)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=
NEXT_PUBLIC_LASTFM_API_KEY=
```

## Run

- `npm run dev`
- Go to the local client, probably `http://localhost:3000`

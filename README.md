# AL Radio

## Setup

- get mongo: `brew tap mongodb/brew && brew install mongodb-community`
- get ffmpeg: `brew install ffmpeg`
- get spotdl: `pip install spotdl`
- `npm i`
- populate `.env.local`

## Run

- `node --env-file=.env.local src/index.js`
- listen to the stream `mpg123 http://localhost:$PORT/stream`

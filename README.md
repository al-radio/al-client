# AL Radio

## Setup

- get ffmpeg: `brew install ffmpeg` or some other bethod
- get spotdl: `pip install spotdl` only method
- `npm i`
- populate `.env.local` and rename to `.env`

### With local db

- get mongo: `brew tap mongodb/brew && brew install mongodb-community` or some other method
- populate `MONGO_URI` in `.env` with `mongodb://localhost:28017`
- `mkdir -p db && mongod --dbpath db --port 28017`

### With hosted db

- populate `MONGO_URI` in `.env` with `mongodb://localhost:28017`

## Run

- `npm run start:local`

# AL Radio

Community driven radio station with host AL.

AL Radio uses `gpt-4o-mini` to generate an introduction for each song and OpenAI's Text-to-Speech models to announce it.

AL Radio uses the Spotify API to gather song metadata and recommendations based off of previous songs as to maintain a general genre

AL Radio accepts song requests in the form of a search query, a Spotify Track ID, or a Spotify Track URL. These requests are given priority over the recommendation algorithm, allowing users to shift the genre of the station over time.

## Setup

- `npm i`
- FFmpeg: `brew install ffmpeg` or your system equiavlent.
- SpotDL: `pip install spotdl`.

### Use Local Database

- Get MongoDB: `brew tap mongodb/brew && brew install mongodb-community` or your system equivalent.
- Run `npm run mongo:local`

Add `mongodb://localhost:28017` to the `MONGO_URI` environment variable:

```conf
# .env
MONGO_URI=mongodb://localhost:28017
```

### Use Hosted Database

Add your MongoDB URI to the `MONGO_URI` environment variable:

```conf
# .env
MONGO_URI=mongodb+srv://{username}:{password}@{appname}.s04om.mongodb.net/...
```

### Add Credentials

These 4 credentials are required for AL Radio to function.

```conf
# .env
SPOTIFY_CLIENT_SECRET=
SPOTIFY_CLIENT_ID=
OPENAI_API_KEY=
MONGO_URI=
```

### HTTP Proxy

Youtube has been cracking down on video downloading by IP banning large ranges. To get around this, AL Radio is equipped with the ability to send requests through proxy servers.

```conf
# .env
PROXY_LIST_URL=
```

Populate this environment variable with a URL that returns a list of proxy servers, separated by `/r/n`.

### Customize

#### Initial Tracks

Add your initial Spotify Track IDs separated by a comma. These will get added to the suggestion queue. This is required for runs with an empty database in order to start playing music.

```conf
# .env
INITIAL_TRACK_IDS=0HNYFFOwID6HGSqy5xr4av,3f1yAg2u74Wn8Jj14zhJGS,5gPNOBxIfT1Aap0Ji4L5xi,2T6esRR7vvAjJTYJFVIXxt,3NGpqL9pwQjWzb358tJMHM
```

#### Client Port

The client will exist on the port defined in `.env`, defaulting to `3000`.

```conf
# .env
PORT=12345
```

## Run

- `npm run start:local`
- Open the client URL displayed (e.g `http://localhost:3002`)

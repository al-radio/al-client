# AL Radio Revival

## Setup

### Service Hosting

- AWS?
- Figure out how to have it hosted and serve people

### Service

- probably js, some broadcasting lib.
- use gpt-4o-mini
- 

### Database

- probably mongo or whatever is cheapest
- table of songs (Spotify ID, metadata, time last played, time first played, times played, prompts used )

#### Algorithm

- There is a db of songs by spotify ID. Times played, first time played, last time played, (who requested?), prompts used, estimated total cost for song, link to song
- Use the last 5 songs played to get new suggestions, make sure they havent been played in the last 3 hours (use ttl in a recently played db for quick check?)
- Pop greedily from user stack as the previous song starts. Check db for ID to get album art and other info for the speaker, minimize requests.
- (maybe scrape for sentiment, but hard to be sure its the right song)
- Have a prompt ready with all info like the last song, the next song, time of day, weather, genre, desired sentiment. Use chatgpt api if there is one
- generate tts for prompt
- crossfade audio file queue

----

1. Retreive user request
2. search spotify for song or get id from url
3. pull ID from spotify
4. add id to user stack

----
1. Auto suggestion stack hits 0
2. Take last 5 song IDs and request 10 more related songs from spotify
3. take 5 songs that havent been played in 3 hours, requesting 5 more each time until 5 are gotten
4. pull song from spotify
5. add id to suggestion stack

#### Data structures

- Current playing song
- Auto suggestion stack (refills when empty, adds 5 each time). Just an ID
- User suggestion stack (100 limit just cause, can get empty). Just an ID
- Song history list (last 100, paginated)
- Up next audio file queue
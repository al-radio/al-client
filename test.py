import os
import subprocess

import openai
import spotipy
from google.cloud import texttospeech

from pydub import AudioSegment
import vlc
from datetime import datetime
import time

from keys import *



def song_info_by_name(song_name: str) -> dict[str, str]:
    """Get song info by name"""
    searchResults = spotifyObject.search(song_name, 1, 0, "track")
    tracks_items = searchResults['tracks']['items']
    song_url = tracks_items[0]['external_urls']['spotify']
    artist = tracks_items[0]['artists'][0]['name']
    album = tracks_items[0]['album']['name']
    track = tracks_items[0]['name']
    release_year = tracks_items[0]['album']['release_date'].split('-')[0]
    song_genres = spotifyObject.artist(tracks_items[0]['artists'][0]['id'])['genres']

    if len(song_genres) > 2:
        genre = song_genres[0] + " and " + song_genres[1]
    elif len(song_genres) > 0:
        genre = song_genres[0]
    else:
        genre = "unknown as of now"
    
    return {
        "song_url": song_url,
        "artist": artist,
        "album": album,
        "track": track,
        "release_year": release_year,
        "genre": genre
    }

def download_and_combine(song_info: dict):
    """Download song from spotify"""

    subprocess.run(["spotdl", "download", song_info['song_url']])
    # check if song is downloaded
    if not os.path.exists(f"{song_info['artist']} - {song_info['track']}.mp3"):
        return False
    host_speech = generate_song_annoncement(song_info)
    generate_tts(host_speech)
    combined_file = combine_tts_song(song_info)

    song_length = AudioSegment.from_mp3(combined_file).duration_seconds
    QUEUE.append((combined_file, song_length))

    return True

def generate_song_annoncement(song_info: dict[str, str]) -> str:
    """Generate prompt for openai"""
    prompt = f"A Toronto radio station called AL Radio is about to play the song \"{song_info['track']}\" by \"{song_info['artist']}\". The song came out in {song_info['release_year']} on an album titled \"{song_info['album']}\". The song's genre is {song_info['genre']}. This is what a radio host for AL Radio would say to the audience, speaking to the tone of {song_info['genre']}, before playing this song."
    full_response = openai.Completion.create(engine="text-curie-001", prompt=prompt, max_tokens=110, temperature=1.0)
    host_speech = full_response['choices'][0]['text']

    if song_info["track"] and song_info["artist"] not in host_speech:
        host_speech = host_speech[:-1] + f" {song_info['track']} by {song_info['artist']}, right now.\""

    return host_speech

def generate_tts(host_speech: str) -> None:
    """Generate TTS from host speech"""
    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=host_speech)
    voice = texttospeech.VoiceSelectionParams(name="en-AU-Neural2-D", language_code="en-AU")
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    speech = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    with open("tts.mp3", "wb") as out:
        out.write(speech.audio_content)

def combine_tts_song(song_info: dict[str, str]) -> str:
    """Combine TTS and song"""
    song_file = AudioSegment.from_mp3(f"{song_info['artist']} - {song_info['track']}.mp3")
    tts_file = AudioSegment.from_mp3("tts.mp3")
    tts_file = tts_file + 6
    combined = tts_file + song_file

    now = datetime.now()
    combined.export(f"{song_info['track']} - {song_info['artist']} {now}.mp3", format="mp3")

    os.remove("tts.mp3")
    os.remove(f"{song_info['artist']} - {song_info['track']}.mp3")

    return f"{song_info['track']} - {song_info['artist']} {now}.mp3"

def gather_recs():
    artist_seed = spotifyObject.recommendations(seed_artists=["5FwydyGVcsQllnM4xM6jw4", "6AX5hnjYSvcjZd9IyqYPsp", "0MkAzpDHUZpuDnWGUII4RN", "13rS3lCWshTVt6HsCNjvBI", "72cBWuYjXkWxEXqZcoH5kE"], limit=15)
    track_seed = spotifyObject.recommendations(seed_tracks=["3hVlV66Z3PfvXwIYOTeZdi", "51R5mPcJjOnfv9lKY1u5sW", "59apounXrrY20vdeMk00SJ", "547Io2VkgfeN4SPRMiDGRt", "4omurqpm7aWH9VVz2Ii4yO"], limit=15)

    # combine the seeds
    return artist_seed['tracks'] + track_seed['tracks']

def play_song(song_name: str, song_length) -> None:
    """Play song"""
    # print("making vlc instance!")
    # instance = vlc.Instance()
    # print("vlc1")
    # player = instance.media_player_new()
    # print("vlc2")
    # media = instance.media_new_path(song_name)
    # print("vlc3")
    # player.set_media(media)
    # print("Im about to play the song")
    # player.play()
    
    # run subprocess asynchronusly
    subprocess.Popen(["vlc", "--play-and-exit", "-Idummy", song_name])
    
    # wait for song to finish
    time.sleep(song_length + 1)

    
if __name__ == "__main__":

    RECOMMENDATION_QUEUE = []
    QUEUE = []
    QUEUED_LAST_24H = set()
    TOKENS_USED = 0
    
    # Authenticate to Spotify, OpenAI, and Google Cloud
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "gtts.json"
    openai.api_key = OPENAI_KEY
    client_secret = SPOTIFY_KEY

    # Prep Spotify
    username = "gsherman27"
    client_id = "2df7fbe926664abf83f560e5b78814e2"
    redirect_uri = "http://google.com/"

    # Get the token
    oauth_object = spotipy.SpotifyOAuth(client_id,client_secret,redirect_uri)
    token_dict = oauth_object.get_access_token()
    token = token_dict['access_token']
    spotifyObject = spotipy.Spotify(auth=token)

    user = spotifyObject.current_user()


    starting_ten = gather_recs()

    # print out the starting tracks
    print("Starting tracks:")
    for i in range(len(starting_ten)):
        print(f"{i+1}. {starting_ten[i]['name']} by {starting_ten[i]['artists'][0]['name']}")

    # add each song name to the recommendation queue if it isn't already there
    for i in range(len(starting_ten)):
        if starting_ten[i]['name'] + " " + starting_ten[i]['artists'][0]['name'] not in QUEUED_LAST_24H:
            RECOMMENDATION_QUEUE.append(starting_ten[i]['name'] + " " + starting_ten[i]['artists'][0]['name'])
            QUEUED_LAST_24H.add(starting_ten[i]['name'] + " " + starting_ten[i]['artists'][0]['name'])
    
    songs_played = 0
    num_downloadings = 0
    currently_playing = False
    song_playing = None

 
    while True:

        # have a sub process for a get request from the user to add a song to the queue
        # the song title must be less than 50 characters. This is done in a subprocess.


        # run if queue is getting low and we're not currently downloading
        if len(QUEUE) < 1 and num_downloadings < 3:
            num_downloadings += 1
            song_info = song_info_by_name(RECOMMENDATION_QUEUE.pop(0))

            # create a new process to run the function download_and_combine in parallel. 
            # the return value of the function should be added to the queue
            if not download_and_combine(song_info):
                continue
            currently_downloading = False
            num_downloadings -= 1

        # get more recs if needed
        if len(RECOMMENDATION_QUEUE) < 4:
            new_recs = gather_recs()
            for i in range(len(new_recs)):
                if new_recs[i]['name'] + " " + new_recs[i]['artists'][0]['name'] not in QUEUED_LAST_24H:
                    RECOMMENDATION_QUEUE.append(new_recs[i]['name'] + " " + new_recs[i]['artists'][0]['name'])
                    QUEUED_LAST_24H.add(new_recs[i]['name'] + " " + new_recs[i]['artists'][0]['name'])


        if not currently_playing and len(QUEUE) > 0:
            song, song_length = QUEUE.pop(0)
            song_playing = song
            p = os.fork()
            currently_playing = True
        
        if p == 0:
            print("Playing song: " + song)
            play_song(song, song_length)
            print("Song finished")
            os.remove(song)
            os._exit(0)
        elif p > 0:
            pid, sts = os.waitpid(p, os.WNOHANG)
            # check the exit code of the child process to see if it has finished
            if pid > 0:
                currently_playing = False
                songs_played += 1







            


        
            





    


    


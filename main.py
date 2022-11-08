import os
import subprocess
import threading
import time

import openai
import spotipy
from google.cloud import texttospeech

from pydub import AudioSegment
from datetime import datetime
from colorama import Fore, Back, Style

from keys import *



class MediaGatherer:

    def __init__(self, username, client_id, client_secret, redirect_uri) -> None:
        self.username = username
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.token = self.get_token()

    def get_token(self):
        oauth_object = spotipy.SpotifyOAuth(
            self.client_id,
            self.client_secret,
            self.redirect_uri,
        )
        token = oauth_object.get_access_token(as_dict=False)
        return token
    
    def get_object(self):
        return spotipy.Spotify(auth=self.get_token())

    def get_recommendations(self, seed_artists: list[str], seed_tracks = list[str], limit: int = 5) -> list[str]:
        """Get recommendations from spotify"""
        spotifyObject = self.get_object()
        recommendations1 = spotifyObject.recommendations(seed_artists=seed_artists, limit=limit)
        recommendations2 = spotifyObject.recommendations(seed_tracks=seed_tracks, limit=limit)
        return recommendations1['tracks'] + recommendations2['tracks']
    
    def get_song_info(self, search_query: str) -> dict[str, str]:
        """Get song info by search query"""
        spotifyObject = self.get_object()
        searchResults = spotifyObject.search(search_query, 1, 0, "track")
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
            genre = "unknown"
        
        return {
            "song_url": song_url,
            "artist": artist,
            "album": album,
            "track": track,
            "release_year": release_year,
            "genre": genre
        }
    
class HostPrompt:

    def __init__(self) -> None:
        self.engine = "text-curie-001"
        self.temperature = 0.9
        self.max_tokens = 110

    def get_completion(self, song_info: dict[str, str]) -> str:
        prompt = f"A Toronto radio station called AL Radio is about to play the song \"{song_info['track']}\" by \"{song_info['artist']}\". The song came out in {song_info['release_year']} on an album titled \"{song_info['album']}\". The song's genre is {song_info['genre']}. This is what a radio host for AL Radio would say to the audience, speaking to the tone of {song_info['genre']}, before playing this song."
        response = openai.Completion.create(engine=self.engine, prompt=prompt, temperature=self.temperature, max_tokens=self.max_tokens)

        if song_info["track"] and song_info["artist"] not in response['choices'][0]['text']:
            response['choices'][0]['text'] = response['choices'][0]['text'][:-1] + f" {song_info['track']} by {song_info['artist']}, right now.\""
        
        global TOKENS_USED
        TOKENS_USED += response['usage']['total_tokens']
        print(f"{Fore.LIGHTBLUE_EX}Tokens used:{Style.RESET_ALL} {TOKENS_USED} ::: {Fore.LIGHTRED_EX}Estimated Cost: {Style.RESET_ALL}${round(TOKENS_USED / 1000 * 0.002, 4)}")
        
        return response['choices'][0]['text']

class TTS:

    def __init__(self, project_id = None) -> None:
        self.project_id = project_id

    def get_speech(self, text: str) -> str:
        """Generate speech from text"""
        client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(name="en-AU-Neural2-D", language_code="en-AU")
        audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
        speech = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

        return speech
    
    def download_speech(self, speech: str, file_name: str) -> None:
        """Download speech to file"""
        with open(file_name, "wb") as out:
            out.write(speech.audio_content)

class SongDownloader:

    def __init__(self, song_info: dict[str, str]) -> None:
        self.song_url = song_info['song_url']
        self.artist = song_info['artist']
        self.album = song_info['album']
        self.track = song_info['track']
        self.release_year = song_info['release_year']
        self.genre = song_info['genre']
        self.song_info = song_info

    def download_song(self, date) -> str:
        """Download song from spotify"""

        # get the date string to the ms
        subprocess.run(
            ["spotdl", "download", self.song_info['song_url']],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.STDOUT)
        
        if not os.path.exists(f"{self.song_info['artist']} - {self.song_info['track']}.mp3"):
            return False
        
        # rename the file to the correct format
        os.rename(f"{self.song_info['artist']} - {self.song_info['track']}.mp3", date + "song.mp3")
        return True
    
    def download_combine(self, speech: str) -> None:
        """Download the song and combine it with the tts"""
        tts = TTS()
        tts_speech = tts.get_speech(speech)
        date = str(datetime.now())
        tts.download_speech(tts_speech, date + "tts.mp3")
        if not self.download_song(date):
            return False
        
        return self.combine_songs(date)
    
    def combine_songs(self, date: str) -> str:
        """Combine the song and tts"""
        song = AudioSegment.from_mp3(date + "song.mp3")
        tts = AudioSegment.from_mp3(date + "tts.mp3")
        combined = tts + song
        filename = "./media/" + date + f"$delim${self.track} - {self.artist}.mp3"
        combined.export(filename, format="mp3")
        # remove the files
        os.remove(date + "song.mp3")
        os.remove(date + "tts.mp3")
        return filename
    

def download_and_add_to_queue():
    song = RECOMMENDATION_QUEUE.pop(0)
    print(f"{Fore.RED}Downloading:{Style.RESET_ALL} " + song)
    song_info = spotify.get_song_info(song)
    song_downloader = SongDownloader(song_info)
    host_prompt = HostPrompt()
    speech = host_prompt.get_completion(song_info)
    filename = song_downloader.download_combine(speech)
    if filename:
        SONG_QUEUE.append(filename)
    print(f"{Fore.BLUE}Downloaded:{Style.RESET_ALL} {song_info['track']} by {song_info['artist']}")
    global CURRENTLY_DOWNLOADING
    CURRENTLY_DOWNLOADING -= 1

def wait_for_play(filename):
    # get song length from file
    song = AudioSegment.from_mp3(filename)
    song_length = len(song) / 1000
    time.sleep(song_length)
    title = filename.split("$delim$")[1].replace(".mp3", "")
    print(f"{Fore.CYAN}Finished Playing:{Style.RESET_ALL} " + title)
    global SONGS_PLAYED
    SONGS_PLAYED += 1
    print(f"{Fore.MAGENTA}Songs Played:{Style.RESET_ALL} {SONGS_PLAYED}")
    os.remove(filename)
    global CURRENTLY_PLAYING
    CURRENTLY_PLAYING = False

def get_new_recs():
    artist_seed = ["5FwydyGVcsQllnM4xM6jw4", "6AX5hnjYSvcjZd9IyqYPsp", "0MkAzpDHUZpuDnWGUII4RN", "13rS3lCWshTVt6HsCNjvBI", "72cBWuYjXkWxEXqZcoH5kE"]
    track_seed = ["3hVlV66Z3PfvXwIYOTeZdi", "51R5mPcJjOnfv9lKY1u5sW", "59apounXrrY20vdeMk00SJ", "547Io2VkgfeN4SPRMiDGRt", "4omurqpm7aWH9VVz2Ii4yO"]
    recs = spotify.get_recommendations(artist_seed, track_seed)
    for recommendation in recs:
        RECOMMENDATION_QUEUE.append(recommendation['name'] + " " + recommendation['artists'][0]['name'])
    print(f"{Fore.LIGHTYELLOW_EX}Got new recommendations!{Style.RESET_ALL}")
    global GATHERING_RECS
    GATHERING_RECS = False

if __name__ == "__main__":

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "gtts.json"
    openai.api_key = OPENAI_KEY
    spotify = MediaGatherer("gsherman27", "2df7fbe926664abf83f560e5b78814e2", SPOTIFY_KEY, "http://google.com/")

    RECOMMENDATION_QUEUE = []
    SONG_QUEUE = []
    
    get_new_recs()

    CURRENTLY_DOWNLOADING = 0
    CURRENTLY_PLAYING = False
    GATHERING_RECS = False
    SONGS_PLAYED = 0
    TOKENS_USED = 0 


    while True:
        if len(SONG_QUEUE) < 2 and CURRENTLY_DOWNLOADING < 2:
            CURRENTLY_DOWNLOADING += 1
            time.sleep(1)
            threading.Thread(target=download_and_add_to_queue).start()
        
        if len(SONG_QUEUE) > 0 and not CURRENTLY_PLAYING:
            CURRENTLY_PLAYING = True
            song = SONG_QUEUE.pop(0)
            title = song.split("$delim$")[1].replace(".mp3", "")
            print(f"{Fore.GREEN}Playing:{Style.RESET_ALL} " + title)
            subprocess.Popen(["vlc", "--play-and-exit", "-Idummy", song],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.STDOUT)
            threading.Thread(target=wait_for_play, args=(song,)).start()
        
        if len(RECOMMENDATION_QUEUE) < 4 and not GATHERING_RECS:
            GATHERING_RECS = True
            threading.Thread(target=get_new_recs).start()
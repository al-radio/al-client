import AudioPlayer from '../components/AudioPlayer';
import SongHistory from '@/components/SongHistory';
import NextSong from '@/components/NextSong';
import ListenerCount from '@/components/ListenerCount';
import SubmitSong from '@/components/SubmitSong';

export default function Home() {
  return (
    <div>
      <h1>AL Radio</h1>
        <AudioPlayer />
        <SongHistory />
        <NextSong />
        <ListenerCount />
        <SubmitSong />
    </div>
  );
}

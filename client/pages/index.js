import AudioPlayer from '../components/AudioPlayer';
import SongHistory from '@/components/SongHistory';
import NextSong from '@/components/NextSong';

export default function Home() {
  return (
    <div>
      <h1>AL Radio</h1>
        <AudioPlayer />
        <SongHistory />
        <NextSong />
      {/* Other components */}
    </div>
  );
}

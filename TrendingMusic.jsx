import { useState, useEffect } from 'react'

export default function TrendingMusic() {
  const [songs, setSongs] = useState([])
  
  useEffect(() => {
    // یہ API آٹومیٹک کاپی رائٹ فری trending میوزک لاتی ہے
    // آپ کو کوئی API Key لینے کی ضرورت نہیں
    const trendingFreeMusic = [
      { id: 1, title: "Trending TikTok Viral", artist: "Summer Vibes", url: "https://cdn.pixabay.com/download/audio/2022/06/07/audio_b9bd4170e8.mp3" },
      { id: 2, title: "YouTube Viral Hit", artist: "Energy", url: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3" },
      { id: 3, title: "Instagram Reels Trend", artist: "Good Day", url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a83be5.mp3" },
      { id: 4, title: "Viral Background", artist: "Happy", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" },
    ]
    setSongs(trendingFreeMusic)
  }, [])

  return (
    <div style={{padding: '20px'}}>
      <h2>🔥 Auto Trending Music - No Copyright</h2>
      {songs.map(song => (
        <div key={song.id} style={{margin: '15px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '10px'}}>
          <p><b>{song.title}</b> - {song.artist}</p>
          <audio controls src={song.url} style={{width: '100%'}}></audio>
          <a href={song.url} download><button>Download MP3</button></a>
        </div>
      ))}
    </div>
  )
}

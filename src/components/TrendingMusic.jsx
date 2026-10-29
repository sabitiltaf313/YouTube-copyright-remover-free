import { useState, useEffect } from 'react'

export default function TrendingMusic() {
  const [selected, setSelected] = useState<number | null>(null)
  
  const songs = [
    { id: 1, title: "TikTok Viral Trend 2026", url: "https://cdn.pixabay.com/download/audio/2022/06/07/audio_b9bd4170e8.mp3" },
    { id: 2, title: "YouTube Trending No Copyright", url: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3" },
    { id: 3, title: "Instagram Reels Viral", url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a83be5.mp3" },
    { id: 4, title: "YouTube Shorts Hit", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" },
  ]

  return (
    <div style={{padding: '16px'}}>
      <h2 style={{textAlign:'center'}}>🔥 Auto Trending Music - No Copyright</h2>
      {songs.map(s => (
        <div key={s.id} style={{border: selected===s.id ? '2px solid green':'1px solid #555', padding:'12px', borderRadius:'10px', margin:'10px 0'}}>
          <b>{s.title}</b>
          <audio controls src={s.url} style={{width:'100%', marginTop:'6px'}}></audio>
          <button onClick={()=>setSelected(s.id)} style={{marginTop:'8px', background: selected===s.id ? 'green':'black', color:'white', padding:'6px 12px', borderRadius:'6px'}}>
            {selected===s.id ? 'Selected ✅' : 'Use in Video'}
          </button>
        </div>
      ))}
    </div>
  )
}

import { useState } from 'react'

export default function TrendingMusic() {
  const [selected, setSelected] = useState<number | null>(null)
  const songs = [
    { id: 1, title: "TikTok Viral 2026 - No Copyright", url: "https://cdn.pixabay.com/download/audio/2022/06/07/audio_b9bd4170e8.mp3" },
    { id: 2, title: "YouTube Trending NCS - No Copyright", url: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3" },
    { id: 3, title: "Instagram Reels Viral - No Copyright", url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a83be5.mp3" },
    { id: 4, title: "YouTube Shorts Hit - No Copyright", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" },
  ]
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
      <h3 className="text-sm font-bold text-slate-900 mb-3">🔥 Trending Music - Auto No Copyright</h3>
      <div className="grid grid-cols-1 gap-2">
        {songs.map(s => (
          <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl border ${selected===s.id ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="truncate pr-2">
              <span className="text-xs font-bold text-slate-900 block truncate">{s.title}</span>
              <audio controls src={s.url} className="h-6 w-full mt-1"></audio>
            </div>
            <button onClick={()=>setSelected(s.id)} className={`text-[10px] px-3 py-2 rounded-xl font-bold ${selected===s.id ? 'bg-[#00b050] text-white' : 'bg-slate-900 text-white'}`}>
              {selected===s.id ? 'Selected' : 'Use'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

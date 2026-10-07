"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Aurora } from "@/components/Aurora";
import { DEFAULT_MOOD, TRACKS, type Mood } from "@/lib/mood";

type Entry = Mood & { text: string; at: string };

export default function Home() {
  const [mood, setMood] = useState<Mood>(DEFAULT_MOOD);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);
  const [playing, setPlaying] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setMood(data);
      setHistory((h) => [{ ...data, text, at: new Date().toLocaleTimeString() }, ...h].slice(0, 8));
      setText("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const track = TRACKS[mood.track];

  return (
    <main>
      <Aurora mood={mood} />

      <section className="panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={mood.name}
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 0.6 }}
          >
            <div className="emoji">{mood.emoji}</div>
            <h1>{mood.name}</h1>
            <p className="desc">{mood.description}</p>
            <div className="swatches">
              {mood.colors.map((col) => (
                <span key={col} style={{ background: col }} title={col} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <form onSubmit={submit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ako sa cítiš? na čom kóduješ? …"
            maxLength={1000}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) submit(e);
            }}
          />
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} disabled={loading}>
            {loading ? "painting the sky…" : "✨ vibe it"}
          </motion.button>
        </form>
        {error && <p className="error">{error}</p>}

        <div className="player">
          <button className="play" onClick={() => setPlaying((p) => !p)}>
            {playing ? "⏸" : "▶"}
          </button>
          <div>
            <small>now vibing</small>
            <div className="track">{track.title}</div>
          </div>
          {playing && (
            <iframe
              key={track.id}
              className="yt"
              src={`https://www.youtube-nocookie.com/embed/${track.id}?autoplay=1`}
              allow="autoplay; encrypted-media"
              title={track.title}
            />
          )}
        </div>
      </section>

      {history.length > 0 && (
        <aside className="history">
          <h2>mood log</h2>
          {history.map((h, i) => (
            <motion.button
              key={h.at + i}
              className="entry"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setMood(h)}
            >
              <span>{h.emoji}</span>
              <div>
                <strong>{h.name}</strong>
                <small>
                  {h.at} · {h.text.slice(0, 40)}
                </small>
              </div>
            </motion.button>
          ))}
        </aside>
      )}
    </main>
  );
}

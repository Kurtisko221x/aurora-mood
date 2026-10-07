<div align="center">

# 🌌 aurora mood

**Write how you feel. AI paints a living aurora and picks the lo-fi to match.**

<img src="https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=nextdotjs"/>
<img src="https://img.shields.io/badge/Motion-ff0055?style=for-the-badge&logo=framer&logoColor=white"/>
<img src="https://img.shields.io/badge/Claude-D97757?style=for-the-badge&logo=anthropic&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>

</div>

---

A mood journal that doesn't feel like a journal. Type *"tired but hyped, debugging websockets at 2am"* and:

- 🎨 **Claude** reads the emotion and returns a structured palette — base sky color, 3–5 aurora colors, an energy level, a poetic mood name and an emoji (validated with Zod via structured outputs)
- 🌊 **Motion** morphs the background into a drifting, blurred aurora — calm moods move slowly, intense ones swirl fast
- 🎧 the best-fitting **lo-fi stream** (study · synthwave · sleep · jazz) starts with one click — no Spotify/YouTube API key needed
- 📜 a **mood log** lets you jump back to any earlier vibe

## Quick start

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## How it works

```
textarea ──▶ POST /api/mood ──▶ Claude (structured output, MoodSchema)
                                   │
          ◀── { name, emoji, background, colors[], energy, track } ──┘
   │
   ├─▶ <Aurora/>  — 6 motion blobs, blur(90px) + mix-blend-mode: screen
   └─▶ player     — youtube-nocookie embed of the chosen stream
```

| File | What it does |
|---|---|
| `lib/mood.ts` | Zod schema for a mood + the curated stream list |
| `app/api/mood/route.ts` | Server route that asks Claude for the mood, with typed error handling |
| `components/Aurora.tsx` | The animated background |
| `app/page.tsx` | UI: input, mood card, player, history |

## License

MIT

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

export type NowPlaying = {
  title: string;
  artist: string;
  releaseTitle: string;
  hue: number;
  releaseId: string;
};

type PlayerValue = {
  now: NowPlaying | null;
  playing: boolean;
  play: (now: NowPlaying) => void;
  toggle: () => void;
};

const PlayerContext = createContext<PlayerValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<NowPlaying | null>(null);
  const [playing, setPlaying] = useState(false);
  const value = useMemo<PlayerValue>(
    () => ({
      now,
      playing,
      play: (next) => {
        setNow(next);
        setPlaying(true);
      },
      toggle: () => setPlaying((on) => (now ? !on : false)),
    }),
    [now, playing],
  );
  return (
    <PlayerContext.Provider value={value}>
      {children}
      <Tone hue={now?.hue ?? 20} playing={playing && Boolean(now)} />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("Player missing");
  return ctx;
}

function Tone({ hue, playing }: { hue: number; playing: boolean }) {
  useEffect(() => {
    if (!playing) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.045;
    master.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    const base = 174 + (hue % 24) * 6;
    const notes = [0, 3, 7, 10, 12].map((step) => base * 2 ** (step / 12));
    osc.frequency.value = notes[0];
    osc.connect(master);
    osc.start();
    let i = 0;
    const timer = window.setInterval(() => {
      i = (i + 1) % notes.length;
      osc.frequency.linearRampToValueAtTime(notes[i], ctx.currentTime + 0.12);
    }, 520);
    return () => {
      window.clearInterval(timer);
      osc.stop();
      void ctx.close();
    };
  }, [hue, playing]);
  return null;
}

export function PlayerBar() {
  const { now, playing, toggle } = usePlayer();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={toggle}
          disabled={!now}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-bg disabled:opacity-40"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {now ? now.title : "Pick a track in the hall"}
          </p>
          <p className="truncate text-xs text-muted">
            {now
              ? `${now.artist} · ${now.releaseTitle} · room-tone preview, not the master`
              : "Original motifs only. Masters stay with the artist."}
          </p>
        </div>
      </div>
    </div>
  );
}

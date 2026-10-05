import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { usePlayer } from "@/components/player";
import { Shell } from "@/components/shell";
import { Sleeve } from "@/components/sleeve";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { money } from "@/lib/format";
import { addToCart, fileReport, getRelease, recordPlay } from "@/lib/market.functions";

export const Route = createFileRoute("/music/$id")({
  loader: ({ params }) => getRelease({ data: { id: params.id } }),
  component: MusicPage,
});

function MusicPage() {
  const { release } = Route.useLoaderData();
  const player = usePlayer();
  const { user, isPending } = useCurrentUserState();
  const buy = useServerFn(addToCart);
  const playCount = useServerFn(recordPlay);
  const report = useServerFn(fileReport);
  const [note, setNote] = useState("");
  const [plays, setPlays] = useState(release?.plays ?? 0);
  const [detail, setDetail] = useState("");
  const [reason, setReason] = useState("copyright");

  if (!release) {
    return (
      <Shell>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl">That release is gone.</h1>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Sleeve hue={release.hue} pattern={release.pattern} label={release.title} />
        <div>
          <p className="text-xs tracking-[0.18em] text-primary uppercase">{release.kind} · {release.year}</p>
          <h1 className="mt-2 text-5xl">{release.title}</h1>
          <Link to="/artists/$handle" params={{ handle: release.artistHandle }} className="mt-2 inline-block text-lg">
            {release.artistName}
          </Link>
          <p className="mt-4 max-w-xl text-muted">{release.blurb}</p>
          <p className="mt-4 text-2xl tabular-nums">{money(release.priceCents)}</p>
          <p className="text-sm text-muted">{plays} room plays · {release.genre}</p>
          {release.splitNote ? <p className="mt-2 text-sm">Split: {release.splitNote}</p> : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {isPending ? <div className="h-12 w-40 animate-pulse rounded-full bg-line motion-safe" /> : null}
            {!isPending && !user ? (
              <Link to="/login" className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm text-on-primary">Sign in to buy</Link>
            ) : null}
            {user ? (
              <button
                type="button"
                className="h-12 rounded-full bg-primary px-5 text-sm text-on-primary"
                onClick={() => {
                  void buy({ data: { itemType: "release", itemId: release.id } })
                    .then(() => setNote("In your basket."))
                    .catch((err: unknown) => setNote(err instanceof Error ? err.message : "Could not add."));
                }}
              >
                Add to basket
              </button>
            ) : null}
            <Link to="/cart" className="inline-flex h-12 items-center rounded-full border border-line px-5 text-sm">Basket</Link>
          </div>
          {note ? <p className="mt-3 text-sm">{note}</p> : null}
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {release.tracks.map((track, index) => (
              <li key={track.title} className="flex items-center gap-3 py-3">
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-sm tabular-nums"
                  onClick={() => {
                    player.play({
                      title: track.title,
                      artist: release.artistName,
                      releaseTitle: release.title,
                      hue: release.hue + index * 8,
                      releaseId: release.id,
                    });
                    void playCount({ data: { id: release.id } }).then((res) => {
                      if (res.plays) setPlays(res.plays);
                    });
                  }}
                >
                  {index + 1}
                </button>
                <span className="flex-1">{track.title}</span>
                <span className="text-sm text-muted tabular-nums">{track.duration}</span>
              </li>
            ))}
          </ul>
          <form
            className="mt-8 max-w-lg space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!user) return;
              void report({ data: { target: `release:${release.id}`, reason, detail } })
                .then(() => {
                  setDetail("");
                  setNote("Report filed. You can see it on your profile.");
                })
                .catch((err: unknown) => setNote(err instanceof Error ? err.message : "Could not file."));
            }}
          >
            <h2 className="text-2xl">Report this release</h2>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="h-11 w-full rounded-xl border border-line bg-surface px-3">
              <option value="copyright">Copyright</option>
              <option value="harassment">Harassment</option>
              <option value="spam">Spam</option>
              <option value="safety">Safety</option>
              <option value="other">Other</option>
            </select>
            <textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={3} placeholder="What should moderation know?" className="w-full rounded-xl border border-line bg-surface px-3 py-2" />
            {user ? (
              <button type="submit" className="h-11 rounded-full border border-line px-4 text-sm">File report</button>
            ) : (
              <Link to="/login" className="text-sm text-primary">Sign in to report</Link>
            )}
          </form>
        </div>
      </div>
    </Shell>
  );
}

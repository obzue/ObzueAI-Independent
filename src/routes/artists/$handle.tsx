import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { PageIntro, Shell } from "@/components/shell";
import { Sleeve } from "@/components/sleeve";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { money } from "@/lib/format";
import { followState, getArtist, joinList, sendMessage, toggleFollow } from "@/lib/market.functions";

export const Route = createFileRoute("/artists/$handle")({
  loader: ({ params }) => getArtist({ data: { handle: params.handle } }),
  component: ArtistPage,
});

function ArtistPage() {
  const { artist, releases, merch } = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const loadFollow = useServerFn(followState);
  const flip = useServerFn(toggleFollow);
  const list = useServerFn(joinList);
  const write = useServerFn(sendMessage);
  const [following, setFollowing] = useState(false);
  const [listed, setListed] = useState(false);
  const [note, setNote] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const userId = user?.id;
  useEffect(() => {
    if (!userId || !artist) return;
    loadFollow({ data: { handle: artist.handle } })
      .then((state) => {
        setFollowing(state.following);
        setListed(state.listed);
      })
      .catch(() => undefined);
  }, [userId, artist]);

  if (!artist) {
    return (
      <Shell>
        <PageIntro kicker="Artists" title="This stall is empty." lede="No artist uses that handle." />
      </Shell>
    );
  }

  return (
    <Shell>
      <PageIntro kicker={artist.city} title={artist.name} lede={artist.bio} />
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-sm text-muted">{artist.genres} · {artist.followers} following</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {isPending ? <div className="h-11 w-36 animate-pulse rounded-full bg-line motion-safe" /> : null}
          {!isPending && !user ? (
            <Link to="/login" className="inline-flex h-11 items-center rounded-full bg-ink px-4 text-sm text-bg">Sign in to follow</Link>
          ) : null}
          {user ? (
            <>
              <button
                type="button"
                className="h-11 rounded-full bg-primary px-4 text-sm text-on-primary"
                onClick={() => {
                  void flip({ data: { handle: artist.handle } }).then((res) => setFollowing(res.following));
                }}
              >
                {following ? "Following" : "Follow"}
              </button>
              <button
                type="button"
                className="h-11 rounded-full border border-line px-4 text-sm"
                onClick={() => {
                  void list({ data: { handle: artist.handle } }).then(() => {
                    setListed(true);
                    setNote("You're on the list. The artist sees the count, not your email.");
                  });
                }}
              >
                {listed ? "On the list" : "Join the list"}
              </button>
            </>
          ) : null}
        </div>
        {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}

        <h2 className="mt-10 text-3xl">Music</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          {releases.map((release) => (
            <Link key={release.id} to="/music/$id" params={{ id: release.id }}>
              <Sleeve hue={release.hue} pattern={release.pattern} label={release.title} />
              <p className="mt-3 font-medium">{release.title}</p>
              <p className="text-sm tabular-nums">{money(release.priceCents)}</p>
            </Link>
          ))}
        </div>

        <h2 className="mt-10 text-3xl">Merch</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          {merch.map((item) => (
            <Link key={item.id} to="/merch/$id" params={{ id: item.id }}>
              <Sleeve hue={item.hue} pattern={4} label={item.title} />
              <p className="mt-3 font-medium">{item.title}</p>
              <p className="text-sm tabular-nums">{money(item.priceCents)}</p>
            </Link>
          ))}
        </div>

        <form
          className="mt-10 max-w-xl space-y-3 pb-8"
          onSubmit={(event) => {
            event.preventDefault();
            if (!user) return;
            void write({ data: { handle: artist.handle, subject, body } })
              .then(() => {
                setSubject("");
                setBody("");
                setNote("Sent. The stall sees your display name, not your email.");
              })
              .catch((err: unknown) => setNote(err instanceof Error ? err.message : "Could not send."));
          }}
        >
          <h2 className="text-3xl">Write the stall</h2>
          <p className="text-sm text-muted">Messages are for the artist. Keep them inside the community guidelines.</p>
          {user ? (
            <>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="h-12 w-full rounded-2xl border border-line bg-surface px-4" />
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="A note, a show, a question" rows={4} className="w-full rounded-2xl border border-line bg-surface px-4 py-3" />
              <button type="submit" className="h-11 rounded-full bg-ink px-5 text-sm text-bg">Send</button>
            </>
          ) : (
            <Link to="/login" className="inline-flex h-11 items-center text-sm text-primary">Sign in to write</Link>
          )}
        </form>
      </div>
    </Shell>
  );
}

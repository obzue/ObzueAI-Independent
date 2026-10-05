import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { money } from "@/lib/format";
import { getStudio, publishMerch, publishRelease } from "@/lib/market.functions";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
});

function StudioPage() {
  const { user, isPending } = useCurrentUserState();
  const load = useServerFn(getStudio);
  const publish = useServerFn(publishRelease);
  const publishGood = useServerFn(publishMerch);
  const [data, setData] = useState<Awaited<ReturnType<typeof load>> | null>(null);
  const [note, setNote] = useState("");

  function refresh() {
    return load().then(setData);
  }

  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    void refresh().catch((err: unknown) => setNote(err instanceof Error ? err.message : "Studio unavailable."));
  }, [userId]);

  if (isPending) {
    return <Shell><div className="mx-auto max-w-6xl px-4 py-16"><div className="h-10 w-48 animate-pulse rounded-full bg-line motion-safe" /></div></Shell>;
  }
  if (!user) {
    return (
      <Shell>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl">The studio is yours after sign-in.</h1>
          <Link to="/login" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-5 text-sm text-bg">Sign in</Link>
        </div>
      </Shell>
    );
  }

  const shareLabel = data ? `${Math.round(data.share * 100)}%` : "—";

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs tracking-[0.18em] text-primary uppercase">Studio</p>
        <h1 className="mt-2 text-5xl">{data?.profile.displayName ?? "Studio"}</h1>
        <p className="mt-2 max-w-xl text-muted">
          Publish music and merch under @{data?.profile.handle}. Payouts are a ledger in this preview — connect a real payout desk before you take a card in the world.
        </p>
        {data?.profile.plan === "listener" && data.profile.role !== "artist" ? (
          <p className="mt-4 rounded-card border border-line bg-surface p-4 text-sm">
            You're on the listener plan. Open a stall from <Link to="/profile" className="text-primary">your profile</Link> before the hall will list you.
          </p>
        ) : null}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [money(data?.gross ?? 0), "Gross"],
            [money(data?.keep ?? 0), `Keep after ${shareLabel}`],
            [String(data?.fans ?? 0), "Followers"],
            [String(data?.list ?? 0), "Mailing list"],
          ].map(([n, label]) => (
            <div key={label} className="rounded-card border border-line bg-surface p-4">
              <p className="font-display text-2xl tabular-nums">{n}</p>
              <p className="text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <form
            className="space-y-3 rounded-card border border-line bg-surface p-5"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void publish({
                data: {
                  title: String(form.get("title") ?? ""),
                  kind: String(form.get("kind") ?? "album"),
                  genre: String(form.get("genre") ?? ""),
                  price: String(form.get("price") ?? ""),
                  blurb: String(form.get("blurb") ?? ""),
                  tracks: String(form.get("tracks") ?? ""),
                  splitNote: String(form.get("split") ?? ""),
                },
              })
                .then(() => {
                  setNote("Release is on the floor.");
                  event.currentTarget.reset();
                  return refresh();
                })
                .catch((err: unknown) => setNote(err instanceof Error ? err.message : "Could not publish."));
            }}
          >
            <h2 className="text-2xl">New release</h2>
            <input name="title" placeholder="Title" required className="h-11 w-full rounded-xl border border-line px-3" />
            <div className="grid grid-cols-2 gap-2">
              <select name="kind" className="h-11 rounded-xl border border-line px-3">
                <option value="album">Album</option>
                <option value="single">Single</option>
              </select>
              <input name="genre" placeholder="Genre" className="h-11 rounded-xl border border-line px-3" />
            </div>
            <input name="price" type="number" min="0" max="200" step="0.5" placeholder="Price USD" required className="h-11 w-full rounded-xl border border-line px-3" />
            <textarea name="tracks" required rows={4} placeholder={"Track titles, one per line"} className="w-full rounded-xl border border-line px-3 py-2" />
            <textarea name="blurb" rows={3} placeholder="Why someone should buy it" className="w-full rounded-xl border border-line px-3 py-2" />
            <input name="split" placeholder="Royalty split note (optional)" className="h-11 w-full rounded-xl border border-line px-3" />
            <button type="submit" className="h-11 rounded-full bg-ink px-5 text-sm text-bg">Publish release</button>
          </form>

          <form
            className="space-y-3 rounded-card border border-line bg-surface p-5"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void publishGood({
                data: {
                  title: String(form.get("title") ?? ""),
                  kind: String(form.get("kind") ?? ""),
                  price: String(form.get("price") ?? ""),
                  blurb: String(form.get("blurb") ?? ""),
                  stock: String(form.get("stock") ?? ""),
                },
              })
                .then(() => {
                  setNote("Merch is on the floor.");
                  event.currentTarget.reset();
                  return refresh();
                })
                .catch((err: unknown) => setNote(err instanceof Error ? err.message : "Could not publish."));
            }}
          >
            <h2 className="text-2xl">New merch</h2>
            <input name="title" required placeholder="Piece name" className="h-11 w-full rounded-xl border border-line px-3" />
            <input name="kind" placeholder="tee, poster, zine…" className="h-11 w-full rounded-xl border border-line px-3" />
            <input name="price" required type="number" min="1" max="400" step="1" placeholder="Price USD" className="h-11 w-full rounded-xl border border-line px-3" />
            <input name="stock" type="number" min="1" max="500" placeholder="Stock" className="h-11 w-full rounded-xl border border-line px-3" />
            <textarea name="blurb" rows={3} placeholder="What it is" className="w-full rounded-xl border border-line px-3 py-2" />
            <button type="submit" className="h-11 rounded-full bg-primary px-5 text-sm text-on-primary">Publish merch</button>
          </form>
        </div>
        {note ? <p className="mt-4 text-sm">{note}</p> : null}

        <h2 className="mt-10 text-3xl">Inbox</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {(data?.messages.length ?? 0) === 0 ? <li className="py-4 text-muted">No notes yet.</li> : null}
          {data?.messages.map((message) => (
            <li key={message.id} className="py-4">
              <p className="font-medium">{message.subject}</p>
              <p className="text-sm text-muted">From {message.sender_name}</p>
              <p className="mt-1 text-sm">{message.body}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-3xl">Recent sales</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {(data?.sales.length ?? 0) === 0 ? <li className="py-4 text-muted">No settled sales yet.</li> : null}
          {data?.sales.map((sale, index) => (
            <li key={`${sale.title}-${index}`} className="flex justify-between py-3 text-sm">
              <span>{sale.title} · qty {sale.qty}</span>
              <span className="tabular-nums">{money(Number(sale.line_cents))}</span>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}

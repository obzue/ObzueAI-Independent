import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Sleeve } from "@/components/sleeve";
import { MARKET_ALL, money } from "@/lib/format";
import { getHome } from "@/lib/market.functions";

export const Route = createFileRoute("/")({
  loader: () => getHome(),
  component: Home,
});

function Home() {
  const data = Route.useLoaderData();
  const lead = data.releases[0];
  return (
    <Shell>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-10 pb-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs tracking-[0.18em] text-primary uppercase">Independent artists · direct sales</p>
          <h1 className="mt-3 max-w-xl text-5xl leading-[1.05] sm:text-6xl">
            Buy the music from the person who made it.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted">
            ObzueAI Independent is a hall, not a stream. Artists set the price on records and merch. Fans keep what they buy. Every member gets a private assistant that only knows their profile.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/marketplace" search={MARKET_ALL} className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm font-medium text-on-primary">
              Enter the marketplace
            </Link>
            <Link to="/profile" className="inline-flex h-12 items-center rounded-full border border-line px-5 text-sm">
              Open your profile
            </Link>
          </div>
        </div>
        {lead ? (
          <Link to="/music/$id" params={{ id: lead.id }} className="block rounded-card border border-line bg-surface p-4">
            <Sleeve hue={lead.hue} pattern={lead.pattern} label={`${lead.title} by ${lead.artistName}`} />
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs tracking-wide text-muted uppercase">{lead.kind}</p>
                <h2 className="text-2xl">{lead.title}</h2>
                <p className="text-sm text-muted">{lead.artistName}</p>
              </div>
              <p className="font-medium tabular-nums">{money(lead.priceCents)}</p>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="mt-6 bg-ink text-bg">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-4 py-8">
          {[
            [data.counts.artists, "Stalls"],
            [data.counts.releases, "Releases"],
            [data.counts.merch, "Merch pieces"],
          ].map(([n, label]) => (
            <div key={String(label)}>
              <p className="font-display text-3xl tabular-nums sm:text-4xl">{n}</p>
              <p className="text-sm text-bg/70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl">In the room</h2>
          <Link to="/marketplace" search={MARKET_ALL} className="text-sm text-primary">All music</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {data.releases.slice(0, 6).map((release) => (
            <Link key={release.id} to="/music/$id" params={{ id: release.id }} className="group">
              <Sleeve hue={release.hue} pattern={release.pattern} label={release.title} />
              <p className="mt-3 font-medium">{release.title}</p>
              <p className="text-sm text-muted">{release.artistName}</p>
              <p className="text-sm tabular-nums">{money(release.priceCents)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-3xl">Artists with the lights on</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.artists.map((artist) => (
            <Link key={artist.handle} to="/artists/$handle" params={{ handle: artist.handle }} className="rounded-card border border-line bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full font-display text-lg text-bg" style={{ background: `hsl(${artist.hue} 42% 38%)` }}>
                  {artist.name.slice(0, 1)}
                </span>
                <div>
                  <p className="font-medium">{artist.name}</p>
                  <p className="text-sm text-muted">{artist.city} · {artist.genres}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted">{artist.bio}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
          {[
            ["01", "Listen in the room", "Preview a motif, then buy the release. The master stays a file in your library, not a rental."],
            ["02", "Pay the stall", "Basket, ledger, and artist sales live on your account. No card is charged in this preview hall."],
            ["03", "Keep a thinking profile", "Your assistant drafts bios, pitches, and a guidelines check. It never sees another member's private notes."],
          ].map(([n, title, body]) => (
            <article key={n}>
              <p className="font-display text-primary">{n}</p>
              <h3 className="mt-2 text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl">Merch that belongs to the record</h2>
          <Link to="/marketplace" search={{ ...MARKET_ALL, aisle: "merch" }} className="text-sm text-primary">Shop the aisle</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {data.merch.slice(0, 4).map((item) => (
            <Link key={item.id} to="/merch/$id" params={{ id: item.id }}>
              <Sleeve hue={item.hue} pattern={3} label={item.title} />
              <p className="mt-3 font-medium">{item.title}</p>
              <p className="text-sm text-muted">{item.artistName}</p>
              <p className="text-sm tabular-nums">{money(item.priceCents)}</p>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}

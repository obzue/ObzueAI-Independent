import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Shell } from "@/components/shell";
import { Sleeve } from "@/components/sleeve";
import { GENRES, money } from "@/lib/format";
import { browse } from "@/lib/market.functions";

type Search = { q: string; genre: string; aisle: "all" | "music" | "merch" };

export const Route = createFileRoute("/marketplace")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : "",
    genre: typeof search.genre === "string" ? search.genre : "",
    aisle: search.aisle === "music" || search.aisle === "merch" ? search.aisle : "all",
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => browse({ data: deps }),
  component: Marketplace,
});

function Marketplace() {
  const search = Route.useSearch();
  const data = Route.useLoaderData();
  return (
    <Shell>
      <PageIntro
        kicker="Marketplace"
        title="Everything on the floor."
        lede="Search the hall by name, filter a genre, or walk the merch aisle. Prices are the artist's, not a streamer's."
      />
      <div className="mx-auto max-w-6xl px-4">
        <form className="flex flex-col gap-3 sm:flex-row" action="/marketplace">
          <input
            name="q"
            defaultValue={search.q}
            placeholder="Search artists, records, merch"
            className="h-12 flex-1 rounded-full border border-line bg-surface px-4"
          />
          <input type="hidden" name="genre" value={search.genre} />
          <input type="hidden" name="aisle" value={search.aisle} />
          <button type="submit" className="h-12 rounded-full bg-ink px-5 text-sm text-bg">
            Search
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "music", "merch"] as const).map((aisle) => (
            <Link
              key={aisle}
              to="/marketplace"
              search={{ ...search, aisle }}
              className={`inline-flex h-10 items-center rounded-full px-4 text-sm ${search.aisle === aisle ? "bg-ink text-bg" : "border border-line"}`}
            >
              {aisle === "all" ? "All" : aisle === "music" ? "Music" : "Merch"}
            </Link>
          ))}
          <Link to="/marketplace" search={{ ...search, genre: "" }} className={`inline-flex h-10 items-center rounded-full px-4 text-sm ${search.genre === "" ? "bg-primary text-on-primary" : "border border-line"}`}>
            Any genre
          </Link>
          {GENRES.map((genre) => (
            <Link
              key={genre}
              to="/marketplace"
              search={{ ...search, genre, aisle: search.aisle === "merch" ? "all" : search.aisle }}
              className={`inline-flex h-10 items-center rounded-full px-4 text-sm ${search.genre === genre ? "bg-primary text-on-primary" : "border border-line"}`}
            >
              {genre}
            </Link>
          ))}
        </div>
        {data.releases.length + data.merch.length === 0 ? (
          <p className="py-16 text-muted">Nothing in that aisle. Try another name.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 pb-8 md:grid-cols-3">
            {data.releases.map((release) => (
              <Link key={release.id} to="/music/$id" params={{ id: release.id }}>
                <Sleeve hue={release.hue} pattern={release.pattern} label={release.title} />
                <p className="mt-3 font-medium">{release.title}</p>
                <p className="text-sm text-muted">{release.artistName} · {release.genre}</p>
                <p className="text-sm tabular-nums">{money(release.priceCents)}</p>
              </Link>
            ))}
            {data.merch.map((item) => (
              <Link key={item.id} to="/merch/$id" params={{ id: item.id }}>
                <Sleeve hue={item.hue} pattern={4} label={item.title} />
                <p className="mt-3 font-medium">{item.title}</p>
                <p className="text-sm text-muted">{item.artistName} · {item.kind}</p>
                <p className="text-sm tabular-nums">{money(item.priceCents)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}

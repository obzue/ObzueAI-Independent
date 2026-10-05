import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Shell } from "@/components/shell";
import { getHome } from "@/lib/market.functions";

export const Route = createFileRoute("/artists/")({
  loader: () => getHome(),
  component: Artists,
});

function Artists() {
  const data = Route.useLoaderData();
  return (
    <Shell>
      <PageIntro
        kicker="Artists"
        title="The stalls."
        lede="House artists opened the hall. Member stalls show up here the moment someone publishes."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-10 sm:grid-cols-2">
        {data.artists.map((artist) => (
          <Link key={artist.handle} to="/artists/$handle" params={{ handle: artist.handle }} className="rounded-card border border-line bg-surface p-5">
            <p className="text-xs tracking-wide text-primary uppercase">{artist.memberStall ? "Member stall" : "House artist"}</p>
            <h2 className="mt-1 text-3xl">{artist.name}</h2>
            <p className="text-sm text-muted">{artist.city} · {artist.genres} · {artist.followers} following</p>
            <p className="mt-3 text-sm">{artist.bio}</p>
          </Link>
        ))}
      </div>
    </Shell>
  );
}

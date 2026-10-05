import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { MARKET_ALL } from "@/lib/format";
import { getLibrary } from "@/lib/market.functions";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const { user, isPending } = useCurrentUserState();
  const load = useServerFn(getLibrary);
  const [items, setItems] = useState<{ item_type: string; item_id: string; title: string; artist_name: string }[]>([]);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    void load().then((res) => setItems(res.items));
  }, [userId]);

  if (isPending) {
    return <Shell><div className="mx-auto max-w-6xl px-4 py-16"><div className="h-10 w-40 animate-pulse rounded-full bg-line motion-safe" /></div></Shell>;
  }
  if (!user) {
    return (
      <Shell>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl">Library is per member.</h1>
          <p className="mt-3 text-muted">Sign in to see what you settled.</p>
          <Link to="/login" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-5 text-sm text-bg">Sign in</Link>
        </div>
      </Shell>
    );
  }
  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-5xl">Library</h1>
        <p className="mt-2 text-muted">What you settled stays here, on your account.</p>
        {items.length === 0 ? (
          <p className="mt-8">Nothing yet. <Link to="/marketplace" search={MARKET_ALL} className="text-primary">Find a record.</Link></p>
        ) : (
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li key={`${item.item_type}-${item.item_id}`} className="py-4">
                {item.item_type === "merch" ? (
                  <Link to="/merch/$id" params={{ id: item.item_id }} className="font-medium">{item.title}</Link>
                ) : (
                  <Link to="/music/$id" params={{ id: item.item_id }} className="font-medium">{item.title}</Link>
                )}
                <p className="text-sm text-muted">{item.artist_name} · {item.item_type}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Shell>
  );
}

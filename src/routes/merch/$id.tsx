import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { Sleeve } from "@/components/sleeve";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { money } from "@/lib/format";
import { addToCart, getMerch } from "@/lib/market.functions";

export const Route = createFileRoute("/merch/$id")({
  loader: ({ params }) => getMerch({ data: { id: params.id } }),
  component: MerchPage,
});

function MerchPage() {
  const { item } = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const buy = useServerFn(addToCart);
  const [note, setNote] = useState("");
  if (!item) {
    return (
      <Shell>
        <div className="mx-auto max-w-6xl px-4 py-16"><h1 className="text-4xl">That piece is gone.</h1></div>
      </Shell>
    );
  }
  return (
    <Shell>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2">
        <Sleeve hue={item.hue} pattern={4} label={item.title} />
        <div>
          <p className="text-xs tracking-[0.18em] text-primary uppercase">{item.kind}</p>
          <h1 className="mt-2 text-5xl">{item.title}</h1>
          <Link to="/artists/$handle" params={{ handle: item.artistHandle }} className="mt-2 inline-block text-lg">{item.artistName}</Link>
          <p className="mt-4 text-muted">{item.blurb}</p>
          <p className="mt-4 text-2xl tabular-nums">{money(item.priceCents)}</p>
          <p className="text-sm text-muted">{item.stock} in the stall</p>
          <div className="mt-5">
            {isPending ? <div className="h-12 w-40 animate-pulse rounded-full bg-line motion-safe" /> : null}
            {!isPending && !user ? (
              <Link to="/login" className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm text-on-primary">Sign in to buy</Link>
            ) : null}
            {user ? (
              <button
                type="button"
                disabled={item.stock < 1}
                className="h-12 rounded-full bg-primary px-5 text-sm text-on-primary disabled:opacity-40"
                onClick={() => {
                  void buy({ data: { itemType: "merch", itemId: item.id, qty: 1 } })
                    .then(() => setNote("In your basket."))
                    .catch((err: unknown) => setNote(err instanceof Error ? err.message : "Could not add."));
                }}
              >
                {item.stock < 1 ? "Sold out" : "Add to basket"}
              </button>
            ) : null}
          </div>
          {note ? <p className="mt-3 text-sm">{note}</p> : null}
          <p className="mt-6 text-sm text-muted">
            Checkout writes a hall ledger so your library and the artist's sales stay honest. No card is charged in this preview.
          </p>
        </div>
      </div>
    </Shell>
  );
}

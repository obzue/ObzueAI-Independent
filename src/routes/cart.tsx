import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { Sleeve } from "@/components/sleeve";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { MARKET_ALL, money } from "@/lib/format";
import { checkout, getCart, removeFromCart, type CartLine } from "@/lib/market.functions";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { user, isPending } = useCurrentUserState();
  const load = useServerFn(getCart);
  const remove = useServerFn(removeFromCart);
  const settle = useServerFn(checkout);
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [total, setTotal] = useState(0);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function refresh() {
    return load().then((cart) => {
      setLines(cart.lines);
      setTotal(cart.totalCents);
    });
  }

  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    void refresh().catch((err: unknown) => setNote(err instanceof Error ? err.message : "Could not load basket."));
  }, [userId]);

  if (isPending) {
    return (
      <Shell>
        <div className="mx-auto max-w-6xl px-4 py-16"><div className="h-10 w-48 animate-pulse rounded-full bg-line motion-safe" /></div>
      </Shell>
    );
  }
  if (!user) {
    return (
      <Shell>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-4xl">Your basket waits behind sign-in.</h1>
          <p className="mt-3 max-w-lg text-muted">Purchases stay on your account. Sign in, then the basket, library, and studio are yours.</p>
          <Link to="/login" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-5 text-sm text-bg">Sign in</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-5xl">Basket</h1>
        <p className="mt-2 text-sm text-muted">Settling writes an order to the hall ledger. Nothing is charged to a card.</p>
        {lines.length === 0 ? (
          <p className="mt-8">The basket is empty. <Link to="/marketplace" search={MARKET_ALL} className="text-primary">Walk the floor.</Link></p>
        ) : (
          <ul className="mt-8 space-y-4">
            {lines.map((line) => (
              <li key={`${line.itemType}-${line.itemId}`} className="flex gap-4 rounded-card border border-line bg-surface p-3">
                <div className="w-20 shrink-0">
                  <Sleeve hue={line.hue} pattern={line.pattern} label={line.title} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{line.title}</p>
                  <p className="text-sm text-muted">{line.artistName} · qty {line.qty}</p>
                  <p className="tabular-nums">{money(line.priceCents * line.qty)}</p>
                  <button
                    type="button"
                    className="mt-2 text-sm text-primary"
                    onClick={() => {
                      void remove({ data: { itemType: line.itemType, itemId: line.itemId } }).then(() => refresh());
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-2xl tabular-nums">{money(total)}</p>
          <button
            type="button"
            disabled={!lines.length || busy}
            className="h-12 rounded-full bg-primary px-5 text-sm text-on-primary disabled:opacity-40"
            onClick={() => {
              setBusy(true);
              void settle()
                .then((order) => {
                  setNote(`Settled ${order.orderId}. It's in your library.`);
                  return refresh();
                })
                .then(() => router.invalidate())
                .catch((err: unknown) => setNote(err instanceof Error ? err.message : "Could not settle."))
                .finally(() => setBusy(false));
            }}
          >
            {busy ? "Settling…" : "Settle ledger"}
          </button>
        </div>
        {note ? <p className="mt-4 text-sm">{note}</p> : null}
        <Link to="/library" className="mt-6 inline-block text-sm text-primary">Open library</Link>
      </div>
    </Shell>
  );
}

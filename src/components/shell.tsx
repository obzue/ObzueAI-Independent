import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getCart } from "@/lib/market.functions";
import { MARKET_ALL } from "@/lib/format";
import { useServerFn } from "@tanstack/react-start";

const LINKS = [
  { to: "/artists", label: "Artists" },
  { to: "/plans", label: "Plans" },
  { to: "/studio", label: "Studio" },
  { to: "/library", label: "Library" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const loadCart = useServerFn(getCart);
  const [count, setCount] = useState(0);

  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    loadCart()
      .then((cart) => {
        if (!cancelled) setCount(cart.lines.reduce((n, line) => n + line.qty, 0));
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });
    return () => {
      cancelled = true;
    };
    // loadCart identity is not stable; user id and path are the real triggers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, path]);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="font-display text-2xl leading-none tracking-tight">
            Northroom
          </Link>
          <nav className="ml-4 hidden items-center gap-4 md:flex">
            <Link to="/marketplace" search={MARKET_ALL} className="text-sm text-muted hover:text-ink" activeProps={{ className: "text-sm text-ink" }}>
              Marketplace
            </Link>
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted hover:text-ink"
                activeProps={{ className: "text-sm text-ink" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/cart" className="relative grid h-11 w-11 place-items-center rounded-full border border-line" aria-label="Basket">
              <ShoppingBag className="size-4" />
              {count > 0 ? (
                <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs text-on-primary tabular-nums">
                  {count}
                </span>
              ) : null}
            </Link>
            <div className="hidden sm:block">
              {isPending ? (
                <div className="h-8 w-24 animate-pulse rounded-full bg-line motion-safe" />
              ) : user ? (
                <UserButton />
              ) : (
                <Link to="/login" className="inline-flex h-11 items-center rounded-full bg-ink px-4 text-sm text-bg">
                  Sign in
                </Link>
              )}
            </div>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-line md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-line px-4 py-3 md:hidden">
            <div className="flex flex-col">
              <Link to="/marketplace" search={MARKET_ALL} onClick={() => setOpen(false)} className="flex h-11 items-center text-base">
                Marketplace
              </Link>
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center text-base"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/profile" onClick={() => setOpen(false)} className="flex h-11 items-center">
                Profile
              </Link>
              <Link to="/guidelines" onClick={() => setOpen(false)} className="flex h-11 items-center">
                Guidelines
              </Link>
              {!isPending && !user ? (
                <Link to="/login" onClick={() => setOpen(false)} className="flex h-11 items-center text-primary">
                  Sign in
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>
      <main className="pb-28">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2">
          <div>
            <p className="font-display text-xl">Northroom</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              A direct hall for independent artists. Music, merch, and a profile assistant that belongs to the member using it.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link to="/guidelines">Community guidelines</Link>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/plans">Plans</Link>
            <Link to="/profile">Your profile</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageIntro({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-6">
      <p className="text-xs tracking-[0.18em] text-primary uppercase">{kicker}</p>
      <h1 className="mt-2 max-w-3xl text-4xl leading-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-base text-muted">{lede}</p>
    </div>
  );
}

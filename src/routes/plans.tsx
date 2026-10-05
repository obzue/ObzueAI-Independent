import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, Shell } from "@/components/shell";

export const Route = createFileRoute("/plans")({
  component: PlansPage,
});

const PLANS = [
  {
    name: "Listener",
    price: "Free",
    share: "Buy, follow, message",
    points: ["Library on your account", "Follow stalls and join lists", "Profile assistant included", "No public stall"],
  },
  {
    name: "Stall",
    price: "8% of sales",
    share: "Open the shop",
    points: ["Publish releases and merch", "Inbox and mailing-list count", "Royalty split notes on the page", "You keep 92% of the ledger"],
  },
  {
    name: "Resident",
    price: "5% of sales",
    share: "Stay in the building",
    points: ["Everything in Stall", "Lower hall share", "Assistant tuned to a long bio", "Same rules, same moderation"],
  },
];

function PlansPage() {
  return (
    <Shell>
      <PageIntro
        kicker="Plans"
        title="Name a plan. Keep the masters."
        lede="Changing plans does not charge a card. The share is how the hall would take its cut when a real payout desk is connected. Set yours on your profile."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-12 md:grid-cols-3">
        {PLANS.map((plan) => (
          <article key={plan.name} className="flex flex-col rounded-card border border-line bg-surface p-5">
            <h2 className="text-3xl">{plan.name}</h2>
            <p className="mt-2 font-medium">{plan.price}</p>
            <p className="text-sm text-muted">{plan.share}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm">
              {plan.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link to="/profile" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink text-sm text-bg">
              Set on your profile
            </Link>
          </article>
        ))}
      </div>
    </Shell>
  );
}

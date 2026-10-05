import { createFileRoute } from "@tanstack/react-router";
import { LegalDoc } from "@/components/legal";
import { guidelineSections } from "@/content/guidelines";

export const Route = createFileRoute("/guidelines")({
  component: GuidelinesPage,
});

function GuidelinesPage() {
  return (
    <LegalDoc
      kicker="House rules"
      title="Community guidelines"
      updated="October 5, 2026"
      lede="These are the rules for selling, buying, messaging, and using the profile assistant in Northroom. They are written for this hall. They are not legal advice, and they are not optional once you use an account."
      sections={guidelineSections}
    />
  );
}

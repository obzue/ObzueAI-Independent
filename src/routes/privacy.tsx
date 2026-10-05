import { createFileRoute } from "@tanstack/react-router";
import { LegalDoc } from "@/components/legal";
import { privacySections } from "@/content/privacy";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalDoc
      kicker="Privacy"
      title="Privacy policy"
      updated="October 5, 2026"
      lede="This policy explains what Northroom stores when you browse, sign in, buy, publish, message, report, or ask your profile assistant. It is a product policy for this hall, not a substitute for legal advice."
      sections={privacySections}
    />
  );
}

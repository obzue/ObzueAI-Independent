import { createFileRoute } from "@tanstack/react-router";
import { LegalDoc } from "@/components/legal";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalDoc
      kicker="Terms"
      title="Terms of use"
      updated="October 5, 2026"
      lede="These terms are the short contract for using Northroom. The community guidelines and the privacy policy are part of them. If you do not agree, do not sign in."
      sections={[
        {
          id: "service",
          title: "1. The service",
          paragraphs: [
            "Northroom lets people browse a catalog of music and merch, and lets signed-in members keep a profile, a basket, a library, and — if they open a stall — publish releases and goods. A profile assistant drafts text when you ask it to.",
            "The opening artists are part of the product. Member stalls are yours. We provide the hall. We do not become the owner of your masters because you listed them.",
          ],
        },
        {
          id: "ledger",
          title: "2. The preview ledger",
          paragraphs: [
            "Checkout records an order. It does not charge a payment card. Do not tell fans that a card was billed. Plans describe a hall share as accounting, not as a subscription fee collected today.",
            "You are responsible for the truth of your prices, your stock, and your split notes. We may remove a listing that breaks the guidelines.",
          ],
        },
        {
          id: "license",
          title: "3. What a buyer gets",
          paragraphs: [
            "Unless the release page says something narrower, a settled music order is a personal license to listen to that release. It is not a license to resell the master, claim songwriting credit, or use the recording in an advertisement.",
            "Merch, when the listing is for a physical object, is a sale of that object. This preview does not collect a shipping address, so do not treat a settled merch line as proof that a package is in the mail.",
          ],
        },
        {
          id: "your-content",
          title: "4. Your content",
          paragraphs: [
            "You keep the rights you already had. You give the hall permission to host, display, and (for buyers) deliver the listing you published, for as long as it is up and as needed for libraries and disputes after that.",
            "You promise you have the rights the guidelines describe. You will cover the hall for a claim that comes from your listing being something you did not have the right to sell, to the extent the law allows that promise.",
          ],
        },
        {
          id: "assistant",
          title: "5. The assistant",
          paragraphs: [
            "Output is a draft. You decide what becomes public. The assistant can be wrong. Using it does not make the hall a co-writer and does not clear a sample.",
          ],
        },
        {
          id: "stop",
          title: "6. Stopping",
          paragraphs: [
            "You may stop using the hall. We may suspend publishing or an account that breaks the guidelines or the law. The privacy policy explains what rows remain and why.",
          ],
        },
        {
          id: "liability",
          title: "7. Liability",
          paragraphs: [
            "The hall is provided as it is. We do not guarantee uninterrupted service, a particular number of sales, or that a member will behave. To the extent the law allows, we are not liable for indirect or lost-profit damages arising from a listing, a message, or an assistant draft.",
            "Some places do not allow those limits. In those places, the limit is the smallest the law allows. Nothing here removes a right you cannot waive.",
          ],
        },
      ]}
    />
  );
}

import type { LegalSection } from "@/components/legal";

export const privacySections: LegalSection[] = [
  {
    id: "who",
    title: "1. Who we are",
    paragraphs: [
      "This policy describes Northroom, the independent-artist marketplace you are using. It covers the public hall, member profiles, stalls, baskets, the ledger, messages, reports, and the profile assistant.",
      "Northroom is a product policy written for this app. It is not a law-firm memo and not legal advice. If you sell music or merch as a business, you may have your own duties to your fans on top of this page. Read those too.",
      "When this policy says 'the hall', it means the Northroom application and the people operating it. It does not mean the artists, who are members with stalls, not our employees.",
    ],
  },
  {
    id: "scope",
    title: "2. What this policy covers",
    paragraphs: [
      "It covers information you give us, information the product creates because you used it, and information the profile assistant generates from that. It covers house catalog pages, which are public on purpose.",
      "It does not cover a website you open from a link in a bio. If an artist sends you to their own shop, their policy applies there. It does not cover your device maker, your browser, or the sign-in provider you choose (such as Google or X) beyond the account details that provider gives the hall to recognize you.",
      "The preview build stores data so the product works. A published deployment uses a hosted database. The categories of information are the same. The machine they sit on may differ. We do not sell personal information.",
    ],
  },
  {
    id: "you-give",
    title: "3. Information you give us",
    paragraphs: [
      "Account: when you sign in, we receive an identifier, and typically a display name, an email address, and a profile image URL from the sign-in provider. We store a Northroom profile you edit: handle, name, city, genres, public bio, role, plan, a color used for your sleeve, and whether you accepted the guidelines.",
      "Private statement: the field marked private is for you and your profile assistant. It is not placed on the public stall. Do not put secrets you cannot bear to have stored at all, such as passwords or government ID numbers. We do not want them.",
      "Commerce: basket lines, orders, library entries, and sales attributed to a stall. The preview ledger records that you settled an order. It does not store a card number because no card is collected.",
      "Stall content: releases, track titles, blurbs, prices, split notes, merch descriptions, and stock. You chose to make those public by publishing.",
      "Messages: subject, body, your display name, and the fact that your account sent them to a stall. Artists do not receive your email through this form.",
      "Reports: the target, the reason you picked, and the detail you wrote. They are tied to your account so you can see what you filed.",
      "Assistant prompts: the text you submit and the reply we store on your profile so you can read it later.",
    ],
  },
  {
    id: "automatic",
    title: "4. Information collected because you used the hall",
    paragraphs: [
      "Play counts on a release increase when a track preview starts. That counter is public on the release. It is not a unique advertising profile of you.",
      "Follows and mailing-list joins are stored as 'this account follows this handle' or 'this account joined this list'. Artists see counts. They do not get a download of follower emails from Northroom.",
      "We use a session to know you are signed in. The sign-in system keeps the session needed to keep you logged in. We do not ask you to paste that session anywhere.",
      "Basic technical logs can exist on the host that serves the app, the way any website logs a request. We do not build those logs into a public analytics billboard of members. The opening catalog pages may be cached like any public page.",
    ],
  },
  {
    id: "ai",
    title: "5. The profile assistant",
    paragraphs: [
      "The assistant runs only when you press the button. It does not run when you merely open the page. Each member's request includes that member's profile fields, a short list of titles in that member's library, the task you picked, and your prompt. It does not include other members' messages, reports, emails, or private statements.",
      "The request is sent to the xAI API (model grok-4.5) using a key held on the server. Your browser does not receive that key. The provider processes the prompt to return the note. Do not submit information you are not allowed to share, including someone else's unreleased work or their medical details.",
      "We store the prompt and the reply in your profile notes, newest first, and show you the latest ones. There is a cap of several requests per minute so a loop cannot burn the tool. Notes stay until you no longer have the account or we delete them in the course of operating the hall.",
      "The assistant is not a doctor, lawyer, or crisis service. Do not rely on it for those jobs. A guidelines check is a writing aid. It is not a decision by moderation.",
    ],
  },
  {
    id: "purchases",
    title: "6. Purchases and the preview ledger",
    paragraphs: [
      "When you settle a basket, we store an order id, the time, the total, and a sales row per line: which stall, which item, the title, the quantity, and the line amount. Your library stores the title and artist name so you can open what you bought.",
      "We do not attach a full export of the buyer's email to the artist's studio. The artist sees title, quantity, and amount. That is enough to understand a sale and not enough to spam a customer.",
      "No payment card, bank account, or government identity document is collected by this preview. If a later version adds a payment processor, this policy will name it, say what it receives, and move the date at the top. Until that sentence exists, anyone asking you to 'verify a card inside Northroom chat' is not us.",
      "Stock numbers change when merch settles. That is inventory, not a profile of the buyer.",
    ],
  },
  {
    id: "use",
    title: "7. How we use information",
    paragraphs: [
      "To run the hall: show stalls, keep your session, remember your basket, fill your library, deliver a message to the stall you chose, and show you your own assistant notes.",
      "To keep the rules: read a report you filed, look at the public listing it points at, and take the enforcement steps in the community guidelines. We do not read your assistant notes for fun. We may look at a note if you ask us to, or if a safety report says the assistant was used to plan harm.",
      "To improve the product in the ordinary sense: fix a bug you hit, understand that checkout failed, see that a page did not load. We do not sell lists of members to brokers, data cooperatives, or advertisers.",
      "To communicate about the product: the interface itself is the main channel. We do not send a marketing blast from the mailing-list table, because that table does not contain emails for artists to export.",
    ],
  },
  {
    id: "bases",
    title: "8. Why we are allowed to",
    paragraphs: [
      "Depending on where you live, the legal words differ. In plain terms we rely on: you asked us to run an account and a stall; the contract of using the hall; our legitimate interest in keeping a marketplace from being abused; and, where a law requires consent, the button you pressed (joining a list, asking the assistant, accepting the guidelines).",
      "You can use much of the public hall without an account: browsing artists, releases, and these policies. Buying, messaging, reporting, publishing, and the assistant require sign-in because those actions are yours and should not be anonymous vandalism.",
      "If a law requires a different basis for a particular field, we will either get that basis or stop collecting the field. We would rather drop a feature than invent a consent checkbox that does nothing.",
    ],
  },
  {
    id: "sharing",
    title: "9. When we share information",
    paragraphs: [
      "With the stall you chose to message: your display name and the message. With the public: whatever you publish on a stall, including bio, prices, and split notes. With you: your library, your reports, your notes, your studio totals.",
      "With infrastructure that runs the app: the database that stores rows, the host that serves pages, and, when you press the assistant button, the model provider that writes the reply. Those processors get what they need to do that job, not a separate copy of the marketplace to resell.",
      "With the sign-in provider: only what the sign-in flow itself requires. We do not receive your provider password.",
      "With authorities when the law compels it, or when we believe it is necessary to prevent serious harm, especially harm to a child. We do not volunteer member lists to marketers who ask nicely.",
      "If the product is ever transferred as a project, the successor has to honor this policy or tell members about a new one before they rely on the old promises. A transfer is not a silent sale of inboxes.",
    ],
  },
  {
    id: "artists-see",
    title: "10. What artists see, and what they must not do",
    paragraphs: [
      "Artists see their own releases, merch, stock, follower count, mailing-list count, inbox messages addressed to them, and their own sales lines. They do not get a tool to browse every member's email.",
      "Artists are independent. If an artist asks you, off to the side, for a shipping address or a phone number, that request is between you and them. Think before you send it. Northroom's message form is not an address book.",
      "Artists must not use what they learn in the inbox to harass, dox, or discriminate. That is a guidelines problem and, when you report it, a moderation problem. We can remove the stall. We cannot un-know a fact the artist already saw.",
    ],
  },
  {
    id: "cookies",
    title: "11. Cookies and local storage",
    paragraphs: [
      "Sign-in uses a session cookie so you stay signed in on your own visit to the deployed app. The cookie is there to authenticate you, not to follow you around the rest of the web.",
      "The embedded preview may keep the session in a way the preview host requires. That is still a session for this app, not an advertising profile.",
      "We do not drop third-party advertising cookies from this policy's product. If a future page embeds a video from another site, that site may set its own cookies when you press play, and its policy will say so. There is no third-party video embed in the hall today.",
      "You can clear cookies in your browser. You will be signed out. Your library remains on the account, not in the cookie.",
    ],
  },
  {
    id: "retention",
    title: "12. How long we keep it",
    paragraphs: [
      "Profile fields last while the account exists. Public releases and merch last while they are published. Orders and library rows last so you can see what you settled and so a stall's sales ledger is not fiction.",
      "Assistant notes are kept on the profile as a short history. Messages are kept so the artist can read them. Reports are kept so a case can be understood later, including after a listing comes down.",
      "If you stop using a preview database that is wiped when the preview restarts, that data goes with it. A deployed database is durable until deleted under this section. Backups, when the host makes them, rotate on the host's schedule.",
      "We do not promise a self-serve 'delete every row in sixty seconds' button in this version. You may ask, through a report titled as a privacy request, to correct your profile or to close the stall. Some rows (an order the other party relies on, a message already delivered, a report about harm) may be kept even after the public page is gone, in a smaller form, for the dispute or safety reason that required them.",
    ],
  },
  {
    id: "security",
    title: "13. Security",
    paragraphs: [
      "Account actions that touch your rows are checked against the signed-in user on the server. The page does not get to claim 'I am some other member' by typing their id. That is the main control.",
      "No method is perfect. Do not reuse a weak password at the sign-in provider. Do not paste your session into a chat. Tell us if you see another member's private note in your assistant, because that would be a bug we need to stop.",
      "Public bios are public. Do not use them as a place to store recovery codes.",
    ],
  },
  {
    id: "choices",
    title: "14. Your choices",
    paragraphs: [
      "You can browse without an account. You can refuse the assistant by never pressing the button. You can skip the mailing list. You can edit your bio, your handle (if it is free), your plan, and your city.",
      "You can stop following. You can choose not to buy. You can file a report instead of starting a fight in the inbox.",
      "Depending on where you live you may have rights to access, correct, delete, or export personal information, or to object to a use. Use a report with the reason 'other' and enough detail for us to find the account. We may need to confirm you control the sign-in before we change anything that could hurt the real owner. We will not run that request as a way for one fan to pull another fan's data.",
      "If you are in the European Economic Area, the United Kingdom, or a similar regime, you may also complain to a local authority. We would rather fix the row first.",
    ],
  },
  {
    id: "children",
    title: "15. Children",
    paragraphs: [
      "The hall is not for children under 16. We do not knowingly build profiles for them. If you believe a child has an account, report it. We will close it. Do not interact with that account while you wait.",
      "The rule against sexual content involving minors is absolute and is repeated in the community guidelines because it is the most important line in the product.",
    ],
  },
  {
    id: "international",
    title: "16. Where information sits",
    paragraphs: [
      "The people who use a public marketplace are in many places. The database and the model provider may be in countries other than yours, including the United States. When you make an account or press the assistant, you understand the information in this policy is processed there so the feature can run.",
      "We do not offer a separate in-country vault in this version. If that is a hard requirement for your stall, do not put sensitive fan data into Northroom. The product is built not to need it.",
    ],
  },
  {
    id: "changes",
    title: "17. Changes to this policy",
    paragraphs: [
      "We will update the date on the page when the words change. A material change — charging a card, adding shipping addresses, expanding what the assistant can see — will be described in the product, not hidden in a comma.",
      "Old versions matter for old disputes. We will not pretend a new sentence always applied. New collection starts when the new sentence is on the page.",
    ],
  },
  {
    id: "contact",
    title: "18. Contact",
    paragraphs: [
      "Privacy requests and safety reports use the report form on a release, or a note from your profile once you are signed in, with the reason that matches. Include the handle and what you want changed. Do not send identity documents to prove who you are unless we specifically ask, and even then prefer the sign-in provider's own recovery.",
      "There is no separate street-address intake in this preview. If you need a formal notice address for a deployed business, the operator of that deployment should publish it with their terms. Until a street address is printed on this page, do not invent one.",
    ],
  },
  {
    id: "not-legal-advice",
    title: "19. What this page is not",
    paragraphs: [
      "It is not a promise that every member will behave. It is not a warranty that a listing is cleared, original, or safe to sample. It is not a privacy policy for the artists' off-platform lives.",
      "It is the description of how this Northroom build handles information, so you can decide whether to sign in, whether to publish, and whether to press the assistant. If you disagree with it, the honest move is not to use the account features. The public catalog remains readable.",
    ],
  },
];

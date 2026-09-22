import { PatternInfo } from "./types";

export const DARK_PATTERN_CATALOG: PatternInfo[] = [
  {
    id: "pre-checked",
    name: "Pre-checked Boxes",
    severity: "high",
    description:
      "Form fields or checkboxes that are pre-selected by default to enroll users into optional paid add-ons, newsletter marketing, or recurring donations.",
    typicalOccurrence: "Flight booking add-on insurance, extra warranty on checkout, opt-in marketing newsletters.",
    howToSpot: "A blue or colored checkmark already sitting in a box before you click it, often styled in low-contrast gray text.",
    countermeasure: "Slow down at final checkout. Always scan for checkboxes and manually uncheck any optional upsells.",
  },
  {
    id: "hidden-fees",
    name: "Hidden Fees & Drip Pricing",
    severity: "critical",
    description:
      "Incrementally unveiling unexpected mandatory charges, cleaning levies, destination resort fees, or service surcharges near the end of a transaction.",
    typicalOccurrence: "Vacation rentals, concert ticket agencies, hotel booking portals, and food delivery apps.",
    howToSpot: "The final total on the credit card entry page is significantly higher than the advertised price on step 1.",
    countermeasure: "Calculate the base fare plus taxes before proceeding. Check if local laws require all-in upfront pricing.",
  },
  {
    id: "urgency-trap",
    name: "Urgency Traps & Fake Scarcity",
    severity: "high",
    description:
      "Manufactured urgency using artificial countdown timers, fake stock counters ('Only 1 item left!'), or simulated concurrent shoppers.",
    typicalOccurrence: "Flash sale e-commerce, hotel comparison aggregators, and airline booking portals.",
    howToSpot: "Timers that reset to 05:00 upon refreshing the page, or high-pressure flashing red warning text.",
    countermeasure: "Refresh the page or open in an incognito window. Authentic reservations don't reset their countdown timer.",
  },
  {
    id: "roach-motel",
    name: "Roach Motel (Cancellation Obstacles)",
    severity: "critical",
    description:
      "Subscription flows designed so it is frictionless to sign up, but practically impossible or painfully tedious to cancel or downgrade.",
    typicalOccurrence: "Gym memberships, streaming trials, software SaaS subscriptions, newspaper digital passes.",
    howToSpot: "Signup takes 10 seconds online, but cancellation requires phone calls during limited hours or 8 retention survey pages.",
    countermeasure: "Sign up using single-use virtual cards (Privacy.com, Revolut) that can be instantly frozen.",
  },
  {
    id: "confirmshaming",
    name: "Confirmshaming & Guilt Tripping",
    severity: "medium",
    description:
      "Emotionally manipulative button copy designed to induce guilt, shame, or fear of missing out when declining an offer.",
    typicalOccurrence: "Pop-up discount modals, newsletter subscriptions, push notification prompts.",
    howToSpot: "Buttons reading: 'No thanks, I hate saving money' or 'I prefer paying full price' instead of simple 'Cancel' or 'No'.",
    countermeasure: "Ignore the snarky emotional text and confidently hit the decline button.",
  },
  {
    id: "sneak-into-basket",
    name: "Sneak into Basket",
    severity: "high",
    description:
      "Injecting unsolicited items, premium memberships, carbon offsets, or protective warranties into the cart without explicit user consent.",
    typicalOccurrence: "Electronics shopping carts, apparel checkouts, car rental extras.",
    howToSpot: "Surprise items in the cart summary that you never added from any product catalog.",
    countermeasure: "Always audit the itemized cart receipt before clicking 'Pay' or 'Place Order'.",
  },
  {
    id: "trick-questions",
    name: "Trick Questions & Double Negatives",
    severity: "high",
    description:
      "Using convoluted phrasing, double negatives, or reversed checkbox semantics to confuse users into agreeing to terms.",
    typicalOccurrence: "GDPR privacy consent banners, marketing opt-outs, cookie preference toggles.",
    howToSpot: "'Do not uncheck if you wish not to be excluded from promotional communications.'",
    countermeasure: "Read negative qualifiers carefully. Rephrase the sentence into plain English before deciding.",
  }
];

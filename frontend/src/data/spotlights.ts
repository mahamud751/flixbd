// Homepage spotlight cards — merchandising copy that lives in the frontend.
// The products themselves come from the backend; a spotlight only renders when
// its slug exists in the live catalog.
export type SpotlightCopy = {
  kicker: string;
  points: string[];
};

export const spotlightCopy: Record<string, SpotlightCopy> = {
  "crunchyroll-premium": {
    kicker: "Anime",
    points: [
      "Ad-free viewing",
      "Full simulcast library",
      "Mobile, web, and TV",
    ],
  },
  "chatgpt-plus": {
    kicker: "AI",
    points: ["Priority access", "Advanced reasoning", "Data analysis tools"],
  },
};

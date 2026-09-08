import { createFileRoute } from "@tanstack/react-router";
import { LoveExperience } from "@/components/LoveExperience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Para ti 🌹 — una carta, un corazón y una rosa" },
      {
        name: "description",
        content:
          "Abre la carta, deja que el corazón lata y mira florecer la rosa: una animación hecha con amor y código.",
      },
      { property: "og:title", content: "Para ti 🌹 — una carta, un corazón y una rosa" },
      {
        property: "og:description",
        content:
          "Abre la carta, deja que el corazón lata y mira florecer la rosa: una animación hecha con amor y código.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <LoveExperience />;
}

import { createFileRoute } from "@tanstack/react-router";
import BloomingRose from "@/components/BloomingRose";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "I coded this for you 🌹" },
      {
        name: "description",
        content:
          "Una rosa roja floreciendo en código — una animación hecha con amor.",
      },
      { property: "og:title", content: "I coded this for you 🌹" },
      {
        property: "og:description",
        content:
          "Una rosa roja floreciendo en código — una animación hecha con amor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <BloomingRose />;
}

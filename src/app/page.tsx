import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import ResultsGallery from "@/components/landing/results-gallery";
import Resultats from "@/components/landing/resultats";
import Contact from "@/components/landing/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <ResultsGallery />
      <Resultats />
      <Contact />
    </main>
  );
}

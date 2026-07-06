import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import ResultsGallery from "@/components/landing/results-gallery";
import Resultats from "@/components/landing/resultats";
import ResultatsDetail from "@/components/landing/resultats-detail";
import Contact from "@/components/landing/contact";
import PhotoGallery from "@/components/landing/photo-gallery";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <ResultsGallery />
      <Resultats />
      <ResultatsDetail />
      <PhotoGallery />
      <Contact />
    </main>
  );
}

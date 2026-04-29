import Hero from "../components/Hero";
import StartSection from "../components/StartSection";
import FeaturesChess from "../components/FeaturesChess";
import FeaturesGrid from "../components/FeaturesGrid";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import CtaFooter from "../components/CtaFooter";

export default function Home() {
  return (
    <>
      <Hero />
      <StartSection />
      <FeaturesChess />
      <FeaturesGrid />
      <Stats />
      <Testimonials />
      <CtaFooter />
    </>
  );
}

import Hero from "../components/Hero";
import StartSection from "../components/StartSection";
import FeaturesChess from "../components/FeaturesChess";
import FeaturesGrid from "../components/FeaturesGrid";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import CtaFooter from "../components/CtaFooter";
import SEOHead from "../components/SEOHead";
import { getOrganizationSchema, getWebSiteSchema } from "../utils/structuredData";

export default function Home() {
  const jsonLd = [getOrganizationSchema(), getWebSiteSchema()];

  return (
    <>
      <SEOHead
        title="Nature's Gold, Perfected"
        description="Discover Naturalora's range of 100% pure, unprocessed raw honey harvested ethically from untouched wild landscapes."
        canonicalPath="/"
        jsonLd={jsonLd}
      />
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


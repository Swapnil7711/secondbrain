import FAQComponent from "@/components/global/FAQ";
import MagicFeatures from "@/components/global/MagicFeatures";
import SimpleFooter from "@/components/global/SimpleFooter";
import WhySecondBrain from "@/components/global/WhySecondBrain";
import { generalFaqs } from "@/utils";
import BottomCTA from "../components/global/BottomCTA";
import Header from "../components/global/header";
import PageSeo from "../components/global/page_seo";
import Hero3 from "../components/home/hero_3";
import CompanyPricingSection from "../components/pricing/pricingSection";
import HeroHorizontal from "@/components/home/HeroHorizontal";
import Banner from "@/components/global/Banner";
import LiveDemo from "@/components/global/LiveDemo";
import FAQ2 from "@/components/global/FAQ2";

export default function Home({ country }) {
  console.log(country);

  return (
    <div>
      <PageSeo
        title="SecondBrain.fyi | Tired of Answering the Same Questions? Let SecondBrain.fyi Do the Talking"
        description="just document once and let ai give personalised answers to your customers query in seconds"
        slug="/"
      />

      <Header />

      <main>
        <HeroHorizontal />
        {/* <Hero3 className={`pb-20`} /> */}
        <LiveDemo />
        {/* <WhySecondBrain /> */}
        {/* <MagicFeatures /> */}
        <FAQ2 faqs={generalFaqs} />
        {/* <SingleTestimonial /> */}
        <SimpleFooter />
        {/* <BottomCTA /> */}
      </main>
    </div>
  );
}


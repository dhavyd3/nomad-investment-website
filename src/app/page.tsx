import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Transition from "@/components/Transition";
import WhoWeAre from "@/components/WhoWeAre";
import ServiceScroll from "@/components/ServiceScroll";
import PinnedShowcase from "@/components/PinnedShowcase";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <Hero />
        {/* hero -> who: both are near-black, so a long blend makes the seam disappear entirely */}
        <Transition from="var(--ink)" to="var(--navy-deep)" height="40vh" />
        <WhoWeAre />
        <Transition variant="streak" from="var(--navy-deep)" to="#000" height="40vh" />
        <ServiceScroll />
        <Transition from="#000" to="var(--paper)" navTheme="light" height="38vh" />
        <PinnedShowcase />
        <Transition variant="streak" from="var(--paper)" to="var(--ink)" navTheme="light" height="38vh" />
        <WhyChooseUs />
        <ContactFooter />
      </main>
    </>
  );
}

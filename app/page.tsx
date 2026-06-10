import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pillars from "@/components/Pillars";
import LiveStats from "@/components/LiveStats";
import Programmability from "@/components/Programmability";
import Integrations from "@/components/Integrations";
import Sponsors from "@/components/Sponsors";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="cosmos flex min-h-screen flex-col">
      <Header cosmos />
      <main>
        <Hero />
        <LiveStats />
        <Pillars />
        <HowItWorks />
        <Programmability />
        <Integrations />
        <FAQ />
        <Sponsors />
      </main>
      <Footer />
    </div>
  );
}

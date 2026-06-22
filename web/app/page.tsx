import { Footer } from "@/components/Footer";
import { FrameworkSection } from "@/components/FrameworkSection";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ResourceSection } from "@/components/ResourceSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FrameworkSection />
        <ResourceSection />
      </main>
      <Footer />
    </>
  );
}

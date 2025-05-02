import AboutSection from "@/components/about";
import { Faqs } from "@/components/accordion";
import DownloadAppSection from "@/components/download-app";
import Footer from "@/components/footer";
import GallerySection from "@/components/gallery";
import GetStartedSection from "@/components/get-started";
import HeroSection from "@/components/hero";
import Navbar from "@/components/ui/navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <GetStartedSection />
      <Faqs />
      <DownloadAppSection />
      <Footer />
  </main>
  );
}

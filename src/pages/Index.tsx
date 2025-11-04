import { UrlShortener } from "@/components/UrlShortener";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <Hero />
        <UrlShortener />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

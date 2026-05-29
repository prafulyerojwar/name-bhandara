import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/bhandara/HeroSection';
import FeaturedBhandaras from '@/components/bhandara/FeaturedBhandaras';
import HowItWorks from '@/components/bhandara/HowItWorks';
import FestivalBanner from '@/components/animations/FestivalBanner';
import StatsSection from '@/components/bhandara/StatsSection';
import TestimonialsSection from '@/components/bhandara/TestimonialsSection';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <FestivalBanner />
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturedBhandaras />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}

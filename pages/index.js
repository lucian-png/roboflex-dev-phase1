import SEO from '../components/SEO';
import Navbar from '../components/layout/Navbar';
import FooterMinimal from '../components/layout/FooterMinimal';
import HeroSection from '../components/landing/HeroSection';
import ScrollRevealSection from '../components/landing/ScrollRevealSection';
import SocialProofCarousel from '../components/landing/SocialProofCarousel';
import ScarcityBanner from '../components/landing/ScarcityBanner';

export default function LandingPage() {
  return (
    <>
      <SEO pageKey="landing" />
      <Navbar />
      <main>
        <HeroSection />
        <ScrollRevealSection />
        <SocialProofCarousel />
        <ScarcityBanner />
      </main>
      <FooterMinimal />
    </>
  );
}
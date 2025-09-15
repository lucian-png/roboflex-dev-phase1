import SEO from '../components/SEO';
import NavbarMinimal from '../components/layout/NavbarMinimal';
import FooterMinimal from '../components/layout/FooterMinimal';
import HeroSection from '../components/landing/HeroSection';
import ScrollRevealSection from '../components/landing/ScrollRevealSection';
import SocialProofCarousel from '../components/landing/SocialProofCarousel';
import ScarcityBanner from '../components/landing/ScarcityBanner';
  // test comment
export default function LandingPage() {
  return (
    <>
      <SEO pageKey="landing" />
      <NavbarMinimal />
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
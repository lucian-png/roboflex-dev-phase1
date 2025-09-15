import SEO from '../components/SEO';
import NavbarAuth from '../components/layout/NavbarAuth';
import FooterMinimal from '../components/layout/FooterMinimal';
import GateWrapper from '../components/gated/GateWrapper';
import TechnologyHero from '../components/tech/TechnologyHero';
import TechDetailsSection from '../components/tech/TechDetailsSection';

export default function TechnologyPage() {
  return (
    <>
      <SEO pageKey="technology" />
      <NavbarAuth />
      <GateWrapper>
        <TechnologyHero />
        <TechDetailsSection />
      </GateWrapper>
      <FooterMinimal />
    </>
  );
}
import SEO from '../components/SEO';
import NavbarAuth from '../components/layout/NavbarAuth';
import FooterMinimal from '../components/layout/FooterMinimal';
import HeritageGateWrapper from '../components/gated/HeritageGateWrapper';
import HeritageHero from '../components/heritage/HeritageHero';
import HeritageDetailsSection from '../components/heritage/HeritageDetailsSection';

export default function HeritagePage() {
  return (
    <>
      <SEO pageKey="heritage" />
      <NavbarAuth />
      <HeritageGateWrapper>
        <HeritageHero />
        <HeritageDetailsSection />
      </HeritageGateWrapper>
      <FooterMinimal />
    </>
  );
}
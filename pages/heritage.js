import SEO from '../components/SEO';
import NavbarAuth from '../components/layout/NavbarAuth';
import FooterMinimal from '../components/layout/FooterMinimal';
import SecureGateWrapper from '../components/gated/SecureGateWrapper';
import HeritageHero from '../components/heritage/HeritageHero';
import HeritageDetailsSection from '../components/heritage/HeritageDetailsSection';

export default function HeritagePage() {
  return (
    <>
      <SEO pageKey="heritage" />
      <NavbarAuth />
      <SecureGateWrapper contentKey="heritage">
        <HeritageHero />
        <HeritageDetailsSection />
      </SecureGateWrapper>
      <FooterMinimal />
    </>
  );
}
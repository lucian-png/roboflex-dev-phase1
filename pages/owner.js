import SEO from '../components/SEO';
import NavbarAuth from '../components/layout/NavbarAuth';
import FooterMinimal from '../components/layout/FooterMinimal';
import SecureGateWrapper from '../components/gated/SecureGateWrapper';
import OwnerHero from '../components/owner/OwnerHero';
import OwnerContentSection from '../components/owner/OwnerContentSection';

export default function OwnerPage() {
  return (
    <>
      <SEO 
        title="Roboflex Owner Portal" 
        description="Secure access to exclusive Roboflex owner resources and concierge services." 
      />
      <NavbarAuth />
      <SecureGateWrapper contentKey="owner">
        <OwnerHero />
        <OwnerContentSection />
      </SecureGateWrapper>
      <FooterMinimal />
    </>
  );
}
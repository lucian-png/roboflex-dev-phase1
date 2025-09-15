import SEO from '../components/SEO';
import NavbarAuth from '../components/layout/NavbarAuth';
import FooterMinimal from '../components/layout/FooterMinimal';

export default function OwnerPortal() {
  return (
    <>
      <SEO title="Roboflex Owner Portal" description="Private portal for verified Roboflex owners." />
      <NavbarAuth />
      <main style={{ padding: '2rem', minHeight: '80vh' }}>
        <h1>Owner Portal (Phase 1 Placeholder)</h1>
        <p>
          Concierge contact, events, private downloads for owners.
        </p>
      </main>
      <FooterMinimal />
    </>
  );
}
import SEO from '../components/SEO';
import NavbarAuth from '../components/layout/NavbarAuth';
import FooterMinimal from '../components/layout/FooterMinimal';

export default function TechnologyPage() {
  return (
    <>
      <SEO pageKey="technology" />
      <NavbarAuth />
      <main style={{ padding: '2rem', minHeight: '80vh' }}>
        <h1>Technology Page (Phase 1 Placeholder)</h1>
        <p>
          Detailed technical content for authenticated users. Includes TechnologyHero and TechDetailsSection.
        </p>
      </main>
      <FooterMinimal />
    </>
  );
}
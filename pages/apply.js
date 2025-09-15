import SEO from '../components/SEO';
import NavbarMinimal from '../components/layout/NavbarMinimal';
import FooterMinimal from '../components/layout/FooterMinimal';

export default function ApplicationPage() {
  return (
    <>
      <SEO pageKey="application" />
      <NavbarMinimal />
      <main style={{ padding: '2rem', minHeight: '80vh' }}>
        <h1>Application Page (Phase 1 Placeholder)</h1>
        <p>
          Multi-step application form will go here. Integrated with Supabase to store submissions.
        </p>
      </main>
      <FooterMinimal />
    </>
  );
}
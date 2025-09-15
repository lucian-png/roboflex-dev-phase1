import SEO from '../components/SEO';
import NavbarAuth from '../components/layout/NavbarAuth';
import FooterMinimal from '../components/layout/FooterMinimal';

export default function HeritagePage() {
  return (
    <>
      <SEO pageKey="heritage" />
      <NavbarAuth />
      <main style={{ padding: '2rem', minHeight: '80vh' }}>
        <h1>Heritage Page (Phase 1 Placeholder)</h1>
        <p>
          Timeline and image archive for authenticated users. Includes Timeline and ImageGallery components.
        </p>
      </main>
      <FooterMinimal />
    </>
  );
}
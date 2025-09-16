import withRole from '../lib/withRole';
import Navbar from '../components/layout/Navbar';

import SEO from '../components/SEO';
import FooterMinimal from '../components/layout/FooterMinimal';
import OwnerHero from '../components/owner/OwnerHero';
import OwnerContentSection from '../components/owner/OwnerContentSection';

function OwnerPage() {
  return (
    <>
      <SEO pageKey="owner" />
      <Navbar />
      <main>
        <OwnerHero />
        <OwnerContentSection />
      </main>
      <FooterMinimal />
    </>
  );
}

export default withRole(OwnerPage, ['admin', 'owner']);
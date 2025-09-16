import withRole from '../lib/withRole';
import Navbar from '../components/layout/Navbar';

import SEO from '../components/SEO';
import FooterMinimal from '../components/layout/FooterMinimal';
import HeritageHero from '../components/heritage/HeritageHero';
import HeritageDetailsSection from '../components/heritage/HeritageDetailsSection';

function HeritagePage() {
  return (
    <>
      <SEO pageKey="heritage" />
      <Navbar />
      <main>
        <HeritageHero />
        <HeritageDetailsSection />
      </main>
      <FooterMinimal />
    </>
  );
}

export default withRole(HeritagePage, ['admin', 'owner']);
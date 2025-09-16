import withRole from '../lib/withRole';
import Navbar from '../components/layout/Navbar';

import SEO from '../components/SEO';
import FooterMinimal from '../components/layout/FooterMinimal';
import TechnologyHero from '../components/tech/TechnologyHero';
import TechDetailsSection from '../components/tech/TechDetailsSection';

function TechnologyPage() {
  return (
    <>
      <SEO pageKey="technology" />
      <Navbar />
      <main>
        <TechnologyHero />
        <TechDetailsSection />
      </main>
      <FooterMinimal />
    </>
  );
}

export default withRole(TechnologyPage, ['admin', 'owner']);
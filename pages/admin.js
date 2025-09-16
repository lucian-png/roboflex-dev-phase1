import dynamic from 'next/dynamic';

// Import the actual component dynamically with client-side rendering
const AdminPageProtected = dynamic(() => import('../components/AdminPage'), {
  ssr: false, // Disable server-side rendering
});

import withRole from '../lib/withRole';
import Navbar from '../components/layout/Navbar';
import SEO from '../components/SEO';
import FooterMinimal from '../components/layout/FooterMinimal';

function AdminPageWrapper() {
  return (
    <>
      <SEO pageKey="admin" />
      <Navbar />
      <main>
        <AdminPageProtected />
      </main>
      <FooterMinimal />
    </>
  );
}

export default withRole(AdminPageWrapper, ['admin']);
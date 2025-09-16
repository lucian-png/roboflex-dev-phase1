import withRole from '../lib/withRole';
import Navbar from '../components/layout/Navbar';
import SEO from '../components/SEO';
import FooterMinimal from '../components/layout/FooterMinimal';
import AdminPageComponent from '../components/AdminPage';

function AdminPage() {
  return (
    <>
      <SEO pageKey="admin" />
      <Navbar />
      <main>
        <AdminPageComponent />
      </main>
      <FooterMinimal />
    </>
  );
}

export default withRole(AdminPage, ['admin']);
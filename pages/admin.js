import { useEffect, useState } from 'react';
import withRole from '../lib/withRole';
import Navbar from '../components/layout/Navbar';
import SEO from '../components/SEO';
import FooterMinimal from '../components/layout/FooterMinimal';
import AdminPageComponent from '../components/AdminPage'; 
import theme from '../styles/theme';

function AdminPage() {
  const [mounted, setMounted] = useState(false);

  // Client-only render guard
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={container}>
      <SEO pageKey="admin" />
      <Navbar />
      <main style={main}>
        <h1 style={title}>Admin Dashboard</h1>
        <AdminPageComponent />
      </main>
      <FooterMinimal />
    </div>
  );
}

export default withRole(AdminPage, ['admin']);

// ===== Styles =====
const container = {
  background: theme.colors.background,
  color: theme.colors.text,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
};

const main = {
  flex: 1,
  padding: theme.spacing.padding
};

const title = {
  fontSize: theme.typography.headingSize,
  marginBottom: '1.5rem'
};
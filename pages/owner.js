import { useEffect, useState } from 'react';
import withRole from '../lib/withRole';
import Navbar from '../components/layout/Navbar';
import SEO from '../components/SEO';
import FooterMinimal from '../components/layout/FooterMinimal';
import OwnerPageComponent from '../components/OwnerPage';
import theme from '../styles/theme';

function OwnerPage() {
  const [mounted, setMounted] = useState(false);

  // Client-only render guard
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={container}>
      <SEO pageKey="owner" />
      <Navbar />
      <main style={main}>
        <h1 style={title}>Owner Dashboard</h1>
        <OwnerPageComponent />
      </main>
      <FooterMinimal />
    </div>
  );
}

export default withRole(OwnerPage, ['admin', 'owner']);

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
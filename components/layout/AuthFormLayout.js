import theme from '../../styles/theme';

export default function AuthFormLayout({ title, children }) {
  return (
    <div style={container}>
      <div style={form}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: '#111',
  color: 'white'
};

const form = {
  background: '#1e1e1e',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  width: '100%',
  maxWidth: '400px'
};
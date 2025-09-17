import theme from '../../styles/theme';

export default function AuthFormLayout({ title, children }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: theme.colors.background,
      color: theme.colors.text
    }}>
      <form style={{
        background: theme.colors.cardBackground,
        padding: theme.spacing.padding,
        borderRadius: theme.spacing.borderRadius,
        boxShadow: theme.shadows.card,
        width: '100%',
        maxWidth: theme.spacing.maxWidth
      }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: theme.typography.headingSize }}>
          {title}
        </h2>
        {children}
      </form>
    </div>
  );
}
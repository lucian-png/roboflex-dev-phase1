import theme from '../../styles/theme';

export default function ConfirmationLayout({ title, message, note }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: theme.colors.background,
      color: theme.colors.text,
      padding: theme.spacing.padding,
      textAlign: 'center'
    }}>
      <div style={{
        background: theme.colors.cardBackground,
        padding: theme.spacing.padding,
        borderRadius: theme.spacing.borderRadius,
        maxWidth: theme.spacing.maxWidthWide,
        boxShadow: theme.shadows.card
      }}>
        <h2 style={{ fontSize: theme.typography.headingSize }}>{title}</h2>
        <p style={{ fontSize: theme.typography.textSize }}>{message}</p>
        {note && (
          <p style={{
            marginTop: '1rem',
            fontSize: theme.typography.smallTextSize,
            color: theme.colors.textLight
          }}>
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
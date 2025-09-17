import { useRouter } from 'next/router';
import ConfirmationLayout from '../components/layout/ConfirmationLayout';

export default function ResetConfirmationPage() {
  const router = useRouter();
  const { email } = router.query;

  return (
    <ConfirmationLayout
      title="Check Your Email"
      message={
        email
          ? <>We’ve sent a password reset link to <strong>{email}</strong>.<br />Click the link in that email to set a new password.</>
          : 'We’ve sent you a password reset email. Please check your inbox.'
      }
      note="If you don’t see the email within a few minutes, check your spam or junk folder."
    />
  );
}
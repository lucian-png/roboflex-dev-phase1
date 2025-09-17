import { useRouter } from 'next/router';
import ConfirmationLayout from '../components/layout/ConfirmationLayout';

export default function SignupConfirmationPage() {
  const router = useRouter();
  const { email } = router.query;

  return (
    <ConfirmationLayout
      title="Check Your Email"
      message={
        email
          ? <>We’ve sent a confirmation link to <strong>{email}</strong>.<br />Please click the link in that email to activate your account.</>
          : 'We’ve sent you a confirmation email. Please check your inbox.'
      }
      note="If you don’t see the email within a few minutes, check your spam or junk folder."
    />
  );
}
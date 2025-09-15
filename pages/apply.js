import SEO from '../components/SEO';
import NavbarMinimal from '../components/layout/NavbarMinimal';
import FooterMinimal from '../components/layout/FooterMinimal';
import ApplicationForm from '../components/forms/ApplicationForm';

export default function ApplicationPage() {
  return (
    <>
      <SEO pageKey="application" />
      <NavbarMinimal />
      <main style={{ padding: '2rem', minHeight: '80vh' }}>
        <h1>Apply for Consideration</h1>
        <p>
          Please complete all steps of the application. Only qualified applicants will be contacted.
        </p>
        <ApplicationForm />
      </main>
      <FooterMinimal />
    </>
  );
}
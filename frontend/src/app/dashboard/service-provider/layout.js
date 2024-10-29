import { Container,DashboardLayout,HeaderServiceProviderDashboard } from '@/components';


export default function ServiceProviderDashboardLayout({ profile, additionaldetails }) {
  return (
     <DashboardLayout>
      <Container>
      {profile}
      {/* header to toggle */}

    <HeaderServiceProviderDashboard/>
      {additionaldetails}
      </Container>
     </DashboardLayout>
  );
}

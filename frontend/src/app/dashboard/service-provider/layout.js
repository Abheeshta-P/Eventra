
import { Container, DashboardLayout, HeaderServiceProviderDashboard } from '@/components';
export default function ServiceProviderDashboardLayout({ children,additionaldetails,profile }) {
  return (
    <DashboardLayout>
      <Container>
        {profile}
        <HeaderServiceProviderDashboard />
        {additionaldetails}
        {children}
      </Container>
    </DashboardLayout>
  );
}

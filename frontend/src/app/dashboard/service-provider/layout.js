
import { Container, DashboardLayout, HeaderServiceProviderDashboard } from '@/components';
export default function ServiceProviderDashboardLayout({ children,additionaldetails,profile }) {
  return (
    <DashboardLayout>
      <Container>
        {profile}
        <HeaderServiceProviderDashboard />
        <div className='relative transition-all bg-zinc-200 p-4 py-12'>{additionaldetails}</div>
        {children}
      </Container>
    </DashboardLayout>
  );
}

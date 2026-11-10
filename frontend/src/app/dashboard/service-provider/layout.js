
import { Container, DashboardLayout, HeaderServiceProviderDashboard } from '@/components';
export default function ServiceProviderDashboardLayout({ children,additionaldetails,profile }) {
  return (
    <DashboardLayout>
      <Container>
        {profile}
        <HeaderServiceProviderDashboard />
        <div className='relative transition-all bg-zinc-200 p-4 pt-4 pb-6 rounded-2xl border border-zinc-300/80 login-bg'>{additionaldetails}</div>
        {children}
      </Container>
    </DashboardLayout>
  );
}

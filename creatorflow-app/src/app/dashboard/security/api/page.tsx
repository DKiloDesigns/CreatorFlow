import { PageHeader } from '@/components/ui/page-header';
import SecurityDashboard, { SecurityTabs } from '@/components/security/SecurityDashboard';
import { Security as SecurityIcon } from '@mui/icons-material';
import { Box } from '@mui/material';

export default function APISecurityPage() {
  return (
    <>
      <PageHeader
        title="API Keys & Security"
        subtitle="Manage your API keys, monitor security events, and configure access controls"
        breadcrumbs={[
          { label: 'API Security', href: '/dashboard/security/api' }
        ]}
        icon={<SecurityIcon sx={{ fontSize: 24 }} />}
      />
      <SecurityTabs />
      <SecurityDashboard />
    </>
  );
}

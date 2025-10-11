import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Lock as LockIcon, VerifiedUser as VerifiedUserIcon, History as HistoryIcon } from '@mui/icons-material';
import { SecurityTabs } from '@/components/security/SecurityDashboard';

export default function AccountSecurityPage() {
  return (
    <Box>
      <PageHeader
        title="Account Security"
        subtitle="Manage your password, two-factor authentication, and view login history."
        breadcrumbs={[
          { label: 'Account Security', href: '/dashboard/security/account' }
        ]}
        icon={<LockIcon sx={{ fontSize: 24 }} />}
      />
      <SecurityTabs />
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        {/* Change Password Card */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <LockIcon />
              <Typography variant="h6">Change Password</Typography>
            </Box>
            <Typography color="text.secondary" mt={1}>
              Coming soon: Securely update your account password.
            </Typography>
          </CardContent>
        </Card>
        {/* 2FA Card */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <VerifiedUserIcon />
              <Typography variant="h6">Two-Factor Authentication (2FA)</Typography>
            </Box>
            <Typography color="text.secondary" mt={1}>
              Coming soon: Enable or manage two-factor authentication for extra security.
            </Typography>
          </CardContent>
        </Card>
        {/* Login History Card */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <HistoryIcon />
              <Typography variant="h6">Login History</Typography>
            </Box>
            <Typography color="text.secondary" mt={1}>
              Coming soon: View recent login activity for your account.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

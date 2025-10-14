'use client';

import { Box, Typography, Container, Paper, IconButton } from '@mui/material';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles'; // Import useTheme

export default function PrivacyPage() {
  const router = useRouter();
  const theme = useTheme(); // Initialize useTheme
  return (
    <PublicPageLayout>
      <Box component="section" sx={{
        py: { xs: 8, md: 12 }, 
        px: { xs: 4, sm: 3, lg: 4 },
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(to right, #dbeafe, #e9d5ff)' 
          : 'linear-gradient(to right, rgba(30, 58, 138, 0.2), rgba(147, 51, 234, 0.2))',
      }} style={{ paddingBottom: '10px' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <IconButton
              edge="start"
              color="primary"
              aria-label="back"
              onClick={() => router.back()}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 4 }}>
                Privacy Policy
              </Typography>
            </Box>
            <Box sx={{ width: 48, mr: 2 }} /> {/* Spacer to balance the IconButton */}
          </Box>
        </Container>
      </Box>

      {/* Removed Spacer Box */}
      {/* Privacy Policy Content Section (separated from hero) */}
      <Box component="section" sx={{ px: { xs: 4, sm: 3, lg: 4 }, py: 8 }} style={{ paddingTop: '10px' }}> {/* Applied inline style */}
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, color: theme.palette.text.secondary }}> {/* Removed mt here */}
            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                1. Information We Collect
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include:
              </Typography>
              <Box component="ul" sx={{ mb: 2, gap: 0.5, listStyleType: 'disc', listStylePosition: 'inside' }}>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Name and contact information</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Account credentials</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Profile information and preferences</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Communication history with our support team</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Usage data and analytics</Box>
                </Box>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                2. How We Use Your Information
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We use the information we collect to:
              </Typography>
              <Box component="ul" sx={{ mb: 2, gap: 0.5, listStyleType: 'disc', listStylePosition: 'inside' }}>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Provide, maintain, and improve our services</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Process transactions and send related information</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Send technical notices, updates, security alerts, and support messages</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Respond to your comments, questions, and customer service requests</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Communicate with you about products, services, offers, and events</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Monitor and analyze trends, usage, and activities in connection with our services</Box>
                </Box>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                3. Information Sharing
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </Typography>
              <Box component="ul" sx={{ mb: 2, gap: 0.5, listStyleType: 'disc', listStylePosition: 'inside' }}>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>With your explicit consent</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>To comply with legal obligations</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>To protect our rights and safety</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>In connection with a business transfer or merger</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>With trusted service providers who assist us in operating our website and services</Box>
                </Box>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                4. Data Security
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                5. Cookies and Tracking Technologies
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us:
              </Typography>
              <Box component="ul" sx={{ mb: 2, gap: 0.5, listStyleType: 'disc', listStylePosition: 'inside' }}>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Remember your preferences and settings</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Analyze how our website is used</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Provide personalized content and advertisements</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Improve our services and user experience</Box>
                </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You can control cookie settings through your browser preferences, though disabling cookies may affect website functionality.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                6. Third-Party Services
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                7. Your Rights and Choices
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You have the right to:
              </Typography>
              <Box component="ul" sx={{ mb: 2, gap: 0.5, listStyleType: 'disc', listStylePosition: 'inside' }}>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Access and update your personal information</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Request deletion of your personal information</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Opt out of marketing communications</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Request restriction of processing</Box>
                  <Box component="li" sx={{ display: 'list-item' }} style={{ paddingLeft: '20px' }}>Data portability</Box>
                </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                To exercise these rights, please contact us using the information provided below.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                8. Children&apos;s Privacy
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                9. International Data Transfers
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your personal information in accordance with this Privacy Policy.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                10. Changes to This Policy
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 2 }}>
                11. Contact Us
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: theme.palette.background.default }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Email:</Typography>
                <Typography variant="body2">privacy@floai.studio</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Address:</Typography>
                <Typography variant="body2">floai.studio, Inc.</Typography>
                <Typography variant="body2">123 Innovation Drive</Typography>
                <Typography variant="body2">Tech City, TC 12345</Typography>
              </Paper>
            </Box>

            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: theme.palette.divider }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Last updated:</Typography> January 2025
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </PublicPageLayout>
  );
} 
'use client';

import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Typography, Container, IconButton } from '@mui/material';

export default function TermsPage() {
  const router = useRouter();
  return (
    <PublicPageLayout>
      <Box component="section" sx={{ py: 8, px: { xs: 4, sm: 3, lg: 4 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={() => router.back()}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'grey.900', mb: 4 }}>
                Terms of Service
              </Typography>
            </Box>
            <Box sx={{ width: 48, mr: 2 }} /> {/* Spacer to balance the IconButton */}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, color: 'grey.700' }}>
            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'grey.900', mb: 2 }}>1. Acceptance of Terms</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                By accessing and using floai.studio ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'grey.900', mb: 2 }}>2. Use License</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Permission is granted to temporarily download one copy of the materials (information or software) on floai.studio&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box component="li"><Typography variant="body1">modify or copy the materials;</Typography></Box>
                <Box component="li"><Typography variant="body1">use the materials for any commercial purpose or for any public display (commercial or non-commercial);</Typography></Box>
                <Box component="li"><Typography variant="body1">attempt to decompile or reverse engineer any software contained on floai.studio&apos;s website;</Typography></Box>
                <Box component="li"><Typography variant="body1">remove any copyright or other proprietary notations from the materials; or</Typography></Box>
                <Box component="li"><Typography variant="body1">transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</Typography></Box>
              </Box>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'grey.900', mb: 2 }}>3. Disclaimer</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The materials on floai.studio&apos;s website are provided on an &apos;as is&apos; basis. floai.studio makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'grey.900', mb: 2 }}>4. Limitations</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                In no event shall floai.studio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on floai.studio&apos;s website, even if floai.studio or a floai.studio authorized representative has been notified orally or in writing of the possibility of such damage.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'grey.900', mb: 2 }}>5. Accuracy of Materials</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The materials appearing on floai.studio&apos;s website could include technical, typographical, or photographic errors. floai.studio does not warrant that any of the materials on its website are accurate, complete or current. floai.studio may make changes to the materials contained on its website at any time without notice.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'grey.900', mb: 2 }}>6. Links</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                floai.studio has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by floai.studio of the site. Use of any such linked website is at the user&apos;s own risk.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'grey.900', mb: 2 }}>7. Modifications</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                floai.studio may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'grey.900', mb: 2 }}>8. Governing Law</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </Typography>
            </Box>

            <Box component="section">
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'grey.900', mb: 2 }}>9. Contact Information</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                If you have any questions about these Terms of Service, please contact us at support@floai.studio.
              </Typography>
            </Box>

            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="body2" sx={{ color: 'grey.500' }}>
                <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>Last updated:</Typography> January 2025
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </PublicPageLayout>
  );
} 
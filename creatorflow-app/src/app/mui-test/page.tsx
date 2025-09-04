import { Box, Typography, Container } from '@mui/material';

export default function MuiTestPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
        🚀 MUI Test
      </Typography>
      
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1 }}>
        <Typography variant="h5">
          ✅ MUI Components Working!
        </Typography>
        <Typography variant="body2">
          This page uses MUI components without any custom providers.
        </Typography>
      </Box>
    </Container>
  );
}

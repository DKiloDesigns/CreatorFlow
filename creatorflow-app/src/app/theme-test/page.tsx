import { MinimalThemeToggle } from '@/components/ui/MinimalThemeToggle';
import { Box, Typography, Container, Paper } from '@mui/material';

export default function ThemeTestPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
        🌙 Theme System Test
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Dark Mode Toggle
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Click the button below to toggle between light and dark modes:
        </Typography>
        <MinimalThemeToggle />
      </Paper>
    </Container>
  );
}
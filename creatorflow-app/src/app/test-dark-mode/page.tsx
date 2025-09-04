import { ThemeToggle } from '@/components/theme-toggle';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

export default function TestDarkModePage() {
  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Dark Mode Test Page</Typography>
        <ThemeToggle />
      </Box>
      
      {/* Classic solid cards, no gradients */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card sx={{ bgcolor: 'success.50', color: 'success.900', '& .dark &': { bgcolor: 'success.800', color: 'white' } }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Green Card (Success)</Typography>
            <Typography variant="body2">This should have a darker green background in dark mode</Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ bgcolor: 'warning.50', color: 'warning.900', '& .dark &': { bgcolor: 'warning.700', color: 'white' } }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Yellow Card (Warning)</Typography>
            <Typography variant="body2">This should have a darker yellow background in dark mode</Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ bgcolor: 'info.50', color: 'info.900', '& .dark &': { bgcolor: 'info.800', color: 'white' } }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Blue Card (Info)</Typography>
            <Typography variant="body2">This should have a darker blue background in dark mode</Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ bgcolor: 'secondary.50', color: 'secondary.900', '& .dark &': { bgcolor: 'secondary.800', color: 'white' } }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Highlight Card</Typography>
            <Typography variant="body2">This should have a darker purple background in dark mode</Typography>
          </CardContent>
        </Card>
        
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: 'primary.main', 
            '&:hover': { bgcolor: 'primary.dark' },
            fontWeight: 600,
            boxShadow: 2,
            transition: 'all 0.2s'
          }}
        >
          CTA Button
        </Button>
      </Box>
      
      <Card sx={{ mt: 4, bgcolor: 'background.paper', color: 'text.primary', '& .dark &': { bgcolor: 'grey.800', color: 'white' } }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Instructions:</Typography>
          <Box component="ol" sx={{ listStyle: 'decimal inside', display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '1rem' }}>
            <Typography component="li" variant="body2">Make sure you&apos;re in dark mode (click the theme toggle in the navigation or above)</Typography>
            <Typography component="li" variant="body2">Check if the cards above have darker, more visible backgrounds</Typography>
            <Typography component="li" variant="body2">The backgrounds should be distinct from the page background</Typography>
          </Box>
        </CardContent>
      </Card>
      
      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{ height: { xs: 128, sm: 40 }, width: '100%' }} />
    </Box>
  );
}
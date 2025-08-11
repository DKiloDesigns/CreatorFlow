import { Box, Typography } from '@mui/material';

export function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <Box
      component="blockquote"
      sx={{
        bgcolor: 'grey.50',
        borderRadius: 2,
        boxShadow: 1,
        p: 3,
        border: 1,
        borderColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        height: '100%'
      }}
    >
      <Typography 
        component="p" 
        sx={{ 
          color: 'text.primary', 
          fontStyle: 'italic',
          flexGrow: 1,
          lineHeight: 1.6
        }}
      >
        &quot;{quote}&quot;
      </Typography>
      <Typography 
        component="footer" 
        variant="body2" 
        sx={{ 
          color: 'text.secondary', 
          textAlign: 'right',
          fontWeight: 500
        }}
      >
        {author}
      </Typography>
    </Box>
  );
} 
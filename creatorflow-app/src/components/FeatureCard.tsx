import { Box, Typography, Chip } from '@mui/material';

export function FeatureCard({ icon, title, description, plan }: { icon: string; title: string; description: string; plan?: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        border: 1,
        borderColor: 'divider',
        height: '100%'
      }}
    >
      {plan && (
        <Chip
          label={plan}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontSize: '0.75rem',
            fontWeight: 600,
            background: plan === 'Pro' 
              ? 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)'
              : 'grey.200',
            color: plan === 'Pro' ? 'white' : 'text.primary',
            '& .MuiChip-label': {
              px: 1
            }
          }}
        />
      )}
      <Box sx={{ fontSize: '2.5rem', mb: 1 }}>
        {icon}
      </Box>
      <Typography 
        variant="h6" 
        component="h3" 
        sx={{ 
          fontWeight: 'bold', 
          textAlign: 'center',
          mb: 1
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          textAlign: 'center',
          color: 'text.secondary',
          flexGrow: 1
        }}
      >
        {description}
      </Typography>
    </Box>
  );
} 
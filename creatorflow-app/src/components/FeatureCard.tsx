import { Box, Typography, Chip } from '@mui/material';
import { 
  Public, 
  Psychology, 
  MonetizationOn, 
  Groups, 
  PhoneAndroid 
} from '@mui/icons-material';

const iconMap: { [key: string]: any } = {
  '🌐': Public,
  '🤖': Psychology,
  '💸': MonetizationOn,
  '🤝': Groups,
  '📱': PhoneAndroid,
};

export function FeatureCard({ icon, title, description, plan }: { icon: string; title: string; description: string; plan?: string }) {
  const IconComponent = iconMap[icon] || Public;
  
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        p: { xs: 2, sm: 2.5, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid transparent',
        height: '100%',
        minHeight: { xs: 140, sm: 160, md: 180 },
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          border: '2px solid',
          borderColor: 'primary.main'
        }
      }}
    >
      {plan && (
        <Chip
          label={plan}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: '0.625rem',
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
      
      {/* Icon Container */}
      <Box sx={{ 
        width: { xs: 40, sm: 50, md: 60 }, 
        height: { xs: 40, sm: 50, md: 60 }, 
        borderRadius: '50%', 
        bgcolor: 'transparent', 
        color: 'text.primary', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        mx: 'auto', 
        mb: { xs: 1, sm: 1.5, md: 2 },
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.1)',
          color: 'primary.main'
        }
      }}>
        <IconComponent sx={{ fontSize: { xs: 20, sm: 24, md: 32 } }} />
      </Box>
      
      {/* Content Container */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start',
        textAlign: 'center',
        width: '100%'
      }}>
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 'bold', 
            mb: { xs: 0.5, sm: 1 },
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            lineHeight: 1.3,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'flex-start'
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
} 
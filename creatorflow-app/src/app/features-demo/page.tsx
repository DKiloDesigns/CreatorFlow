import { MinimalThemeToggle } from '@/components/ui/MinimalThemeToggle';
import { MinimalCollaborationPanel } from '@/components/collaboration/MinimalCollaborationPanel';
import { Box, Typography, Container, Paper, Grid, Button, Chip, AppBar, Toolbar } from '@mui/material';

export default function FeaturesDemoPage() {
  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CreatorFlow Features Demo
          </Typography>
          <MinimalThemeToggle />
          <MinimalCollaborationPanel />
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
          🚀 CreatorFlow Features Demo
        </Typography>
      
      <Grid container spacing={4}>
        {/* Dark Mode 2.0 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              🌙 Dark Mode 2.0
              <Chip label="✅ Working" color="success" size="small" />
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Advanced theme system with smooth transitions and custom color schemes
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <MinimalThemeToggle />
              <Typography variant="caption">
                Click to toggle theme
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Content Builder */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              🎨 Drag & Drop Content Builder
              <Chip label="✅ Complete" color="success" size="small" />
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Visual content creation interface with drag and drop functionality, auto-save, and export options
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              component="a"
              href="/content-builder-demo"
              target="_blank"
            >
              Launch Content Builder
            </Button>
          </Paper>
        </Grid>

        {/* Real-time Collaboration */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              🤝 Real-time Collaboration
              <Chip label="✅ Working" color="success" size="small" />
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Multi-user collaboration with live cursors and presence indicators
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
              <Typography variant="caption">You are online</Typography>
              <MinimalCollaborationPanel />
            </Box>
          </Paper>
        </Grid>

        {/* Smart Notifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              🔔 Smart Notifications
              <Chip label="✅ Complete" color="success" size="small" />
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              AI-powered notification system with learning algorithms, behavior analysis, and smart scoring
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              component="a"
              href="/smart-notifications-demo"
              target="_blank"
            >
              Launch Smart Notifications
            </Button>
          </Paper>
        </Grid>

        {/* Status Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              📊 Implementation Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>4</Typography>
                  <Typography variant="body2">✅ Completed</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>0</Typography>
                  <Typography variant="body2">🔄 In Progress</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>0</Typography>
                  <Typography variant="body2">❌ Failed</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>100%</Typography>
                  <Typography variant="body2">Complete</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      </Container>
    </>
  );
}

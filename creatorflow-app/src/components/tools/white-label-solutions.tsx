'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
  Badge,
  Menu,
  MenuList,
  ColorPicker
} from '@mui/material';
import {
  Palette,
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning,
  Info,
  ExpandMore,
  Business,
  Security,
  Timeline,
  MonetizationOn,
  Campaign,
  Insights,
  Notifications,
  Chat,
  VideoCall,
  Share,
  Lock,
  Public,
  PersonAdd,
  Settings,
  AdminPanelSettings,
  Assignment,
  Schedule,
  Comment,
  ThumbUp,
  Reply,
  Flag,
  Archive,
  Restore,
  Block,
  Unblock,
  BrandingWatermark,
  ColorLens,
  Image,
  Code,
  Download,
  Upload,
  Preview,
  Save,
  Refresh
} from '@mui/icons-material';

interface BrandTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logo: string;
  status: 'Active' | 'Draft' | 'Archived';
  createdAt: string;
  lastModified: string;
}

interface CustomDomain {
  id: string;
  domain: string;
  status: 'Active' | 'Pending' | 'Error';
  ssl: boolean;
  createdAt: string;
}

interface WhiteLabelConfig {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  features: string[];
  customizations: {
    branding: boolean;
    domain: boolean;
    api: boolean;
    support: boolean;
  };
  createdAt: string;
}

const brandThemes: BrandTheme[] = [
  {
    id: '1',
    name: 'Corporate Blue',
    primaryColor: '#0066CC',
    secondaryColor: '#00CC66',
    accentColor: '#FF6B35',
    fontFamily: 'Inter',
    logo: '/logos/corporate-blue.png',
    status: 'Active',
    createdAt: '2024-01-15',
    lastModified: '2024-06-20'
  },
  {
    id: '2',
    name: 'Creative Purple',
    primaryColor: '#8B5CF6',
    secondaryColor: '#06B6D4',
    accentColor: '#F59E0B',
    fontFamily: 'Poppins',
    logo: '/logos/creative-purple.png',
    status: 'Draft',
    createdAt: '2024-02-01',
    lastModified: '2024-06-18'
  },
  {
    id: '3',
    name: 'Minimalist Gray',
    primaryColor: '#374151',
    secondaryColor: '#6B7280',
    accentColor: '#10B981',
    fontFamily: 'Roboto',
    logo: '/logos/minimalist-gray.png',
    status: 'Active',
    createdAt: '2024-03-10',
    lastModified: '2024-06-15'
  }
];

const customDomains: CustomDomain[] = [
  {
    id: '1',
    domain: 'creatorflow.company.com',
    status: 'Active',
    ssl: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    domain: 'content.tools.com',
    status: 'Pending',
    ssl: false,
    createdAt: '2024-06-20'
  }
];

const whiteLabelConfigs: WhiteLabelConfig[] = [
  {
    id: '1',
    name: 'Enterprise Suite',
    description: 'Full white-label solution with all features',
    status: 'Active',
    features: ['Custom Branding', 'Custom Domain', 'API Access', 'Priority Support'],
    customizations: {
      branding: true,
      domain: true,
      api: true,
      support: true
    },
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Professional Package',
    description: 'Standard white-label with core features',
    status: 'Active',
    features: ['Custom Branding', 'Custom Domain'],
    customizations: {
      branding: true,
      domain: true,
      api: false,
      support: false
    },
    createdAt: '2024-02-01'
  }
];

export default function WhiteLabelSolutions() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<BrandTheme | null>(null);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [showDomainDialog, setShowDomainDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleThemeClick = (theme: BrandTheme) => {
    setSelectedTheme(theme);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Draft': return 'warning';
      case 'Pending': return 'info';
      case 'Error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle color="success" />;
      case 'Draft': return <Warning color="warning" />;
      case 'Pending': return <Info color="info" />;
      case 'Error': return <Warning color="error" />;
      default: return <Info color="disabled" />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{
          background: 'linear-gradient(45deg, #0066CC, #00CC66)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          White-label Solutions
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Customize CreatorFlow with your brand identity and domain
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Create a fully branded experience for your clients and team members.
          </Typography>
        </Alert>
      </Box>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Brand Themes" />
          <Tab label="Custom Domains" />
          <Tab label="White-label Configs" />
          <Tab label="Preview" />
          <Tab label="Settings" />
        </Tabs>

        {/* Brand Themes Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Brand Themes ({brandThemes.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowThemeDialog(true)}
              >
                New Theme
              </Button>
            </Box>

            <Grid container spacing={3}>
              {brandThemes.map((theme) => (
                <Grid item xs={12} sm={6} md={4} key={theme.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 4 },
                      border: selectedTheme?.id === theme.id ? 2 : 0,
                      borderColor: 'primary.main'
                    }}
                    onClick={() => handleThemeClick(theme)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{theme.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={theme.status}
                            color={getStatusColor(theme.status) as any}
                            size="small"
                          />
                          <IconButton onClick={handleMenuClick}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Color Preview */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: theme.primaryColor,
                            borderRadius: 1,
                            border: '1px solid #ddd'
                          }}
                        />
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: theme.secondaryColor,
                            borderRadius: 1,
                            border: '1px solid #ddd'
                          }}
                        />
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: theme.accentColor,
                            borderRadius: 1,
                            border: '1px solid #ddd'
                          }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Font: {theme.fontFamily}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Created: {new Date(theme.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Custom Domains Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Custom Domains ({customDomains.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowDomainDialog(true)}
              >
                Add Domain
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Domain</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>SSL</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customDomains.map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">{domain.domain}</Typography>
                          {domain.ssl && (
                            <Chip label="SSL" size="small" color="success" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(domain.status)}
                          <Typography variant="body2">{domain.status}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={domain.ssl ? 'Enabled' : 'Disabled'}
                          color={domain.ssl ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(domain.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* White-label Configs Tab */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                White-label Configurations ({whiteLabelConfigs.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowConfigDialog(true)}
              >
                New Configuration
              </Button>
            </Box>

            <Grid container spacing={3}>
              {whiteLabelConfigs.map((config) => (
                <Grid item xs={12} md={6} key={config.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{config.name}</Typography>
                        <Chip
                          label={config.status}
                          color={getStatusColor(config.status) as any}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {config.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Features:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {config.features.map((feature) => (
                            <Chip
                              key={feature}
                              label={feature}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Customizations:
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <BrandingWatermark />
                            </ListItemIcon>
                            <ListItemText primary="Custom Branding" />
                            <Switch checked={config.customizations.branding} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Public />
                            </ListItemIcon>
                            <ListItemText primary="Custom Domain" />
                            <Switch checked={config.customizations.domain} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Code />
                            </ListItemIcon>
                            <ListItemText primary="API Access" />
                            <Switch checked={config.customizations.api} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <Support />
                            </ListItemIcon>
                            <ListItemText primary="Priority Support" />
                            <Switch checked={config.customizations.support} />
                          </ListItem>
                        </List>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Created: {new Date(config.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Preview Tab */}
        {activeTab === 3 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Live Preview
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={previewMode ? 'contained' : 'outlined'}
                  startIcon={<Preview />}
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? 'Exit Preview' : 'Enter Preview'}
                </Button>
                <Button variant="outlined" startIcon={<Download />}>
                  Export
                </Button>
              </Box>
            </Box>

            {previewMode ? (
              <Box sx={{ border: '2px dashed #ccc', p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Live Preview Mode
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Your white-label configuration is being applied in real-time
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="contained" startIcon={<Save />}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" startIcon={<Refresh />}>
                    Reset
                  </Button>
                </Box>
              </Box>
            ) : (
              <Alert severity="info">
                <Typography variant="body2">
                  Click "Enter Preview" to see your white-label configuration in action.
                </Typography>
              </Alert>
            )}
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              White-label Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Branding Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Allow Custom Logos"
                          secondary="Let clients upload their own logos"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Custom Color Schemes"
                          secondary="Allow custom color customization"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Custom Fonts"
                          secondary="Allow custom font selection"
                        />
                        <Switch />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Domain Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Auto SSL"
                          secondary="Automatically enable SSL for new domains"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Domain Validation"
                          secondary="Require domain ownership verification"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Subdomain Support"
                          secondary="Allow subdomain configurations"
                        />
                        <Switch />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Theme Dialog */}
      <Dialog open={showThemeDialog} onClose={() => setShowThemeDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Brand Theme</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Theme Name"
            margin="normal"
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Primary Color"
                type="color"
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Secondary Color"
                type="color"
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Accent Color"
                type="color"
                margin="normal"
              />
            </Grid>
          </Grid>
          <FormControl fullWidth margin="normal">
            <InputLabel>Font Family</InputLabel>
            <Select>
              <MenuItem value="Inter">Inter</MenuItem>
              <MenuItem value="Poppins">Poppins</MenuItem>
              <MenuItem value="Roboto">Roboto</MenuItem>
              <MenuItem value="Open Sans">Open Sans</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowThemeDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Theme</Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuList>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Preview />
            </ListItemIcon>
            <ListItemText>Preview</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Download />
            </ListItemIcon>
            <ListItemText>Export</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </Container>
  );
}

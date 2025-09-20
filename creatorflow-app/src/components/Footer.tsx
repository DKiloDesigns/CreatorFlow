import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Link as MuiLink, 
  IconButton, 
  Grid, 
  Divider,
  TextField,
  Button,
  InputAdornment,
  Tooltip,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  YouTube, 
  Instagram, 
  MusicNote, 
  Twitter, 
  Chat, 
  Favorite,
  Email,
  Send,
  Security,
  Verified,
  Apple,
  Android,
  Business,
  Support,
  Description,
  Policy,
  Shield,
  Phone,
  LocationOn,
  Code,
  MonetizationOn,
  Analytics,
  Group,
  Article,
  ContactMail,
  Extension,
  Schedule,
  ExpandMore,
  Call
} from '@mui/icons-material';

export function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Box
        component="footer"
        sx={{
          width: '100%',
          py: 3,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          {/* Mobile: Newsletter Signup - Most Important */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
              Stay Connected
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Get creator tips delivered to your inbox.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, maxWidth: 400, mx: 'auto' }}>
              <TextField
                size="small"
                placeholder="Enter your email"
                variant="outlined"
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<Send />}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>

          {/* Mobile: Essential Links with Accordion */}
          <Box sx={{ mb: 3 }}>
            <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 48, py: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Quick Links
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <MuiLink 
                        component={Link} 
                        href="/about" 
                        color="text.secondary"
                        sx={{ 
                          textDecoration: 'none',
                          '&:hover': { color: 'primary.main' },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 1,
                          minHeight: 44
                        }}
                      >
                        <Business sx={{ fontSize: 18 }} />
                        About Us
                      </MuiLink>
                      <MuiLink 
                        component={Link} 
                        href="/support" 
                        color="text.secondary"
                        sx={{ 
                          textDecoration: 'none',
                          '&:hover': { color: 'primary.main' },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 1,
                          minHeight: 44
                        }}
                      >
                        <Support sx={{ fontSize: 18 }} />
                        Support
                      </MuiLink>
                      <MuiLink 
                        component={Link} 
                        href="/features" 
                        color="text.secondary"
                        sx={{ 
                          textDecoration: 'none',
                          '&:hover': { color: 'primary.main' },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 1,
                          minHeight: 44
                        }}
                      >
                        <MonetizationOn sx={{ fontSize: 18 }} />
                        Features
                      </MuiLink>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <MuiLink 
                        component={Link} 
                        href="/pricing" 
                        color="text.secondary"
                        sx={{ 
                          textDecoration: 'none',
                          '&:hover': { color: 'primary.main' },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 1,
                          minHeight: 44
                        }}
                      >
                        <Analytics sx={{ fontSize: 18 }} />
                        Pricing
                      </MuiLink>
                      <MuiLink 
                        component={Link} 
                        href="/privacy" 
                        color="text.secondary"
                        sx={{ 
                          textDecoration: 'none',
                          '&:hover': { color: 'primary.main' },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 1,
                          minHeight: 44
                        }}
                      >
                        <Policy sx={{ fontSize: 18 }} />
                        Privacy
                      </MuiLink>
                      <MuiLink 
                        component={Link} 
                        href="/terms" 
                        color="text.secondary"
                        sx={{ 
                          textDecoration: 'none',
                          '&:hover': { color: 'primary.main' },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 1,
                          minHeight: 44
                        }}
                      >
                        <Description sx={{ fontSize: 18 }} />
                        Terms
                      </MuiLink>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Mobile: Call Us Button */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<Call />}
              href="tel:+15551234567"
              component="a"
              sx={{ 
                minHeight: 48,
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Call Us: +1 (555) 123-4567
            </Button>
          </Box>

          {/* Mobile: Social Media - Larger Touch Targets */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <IconButton
                component="a"
                href="#"
                aria-label="YouTube"
                sx={{ 
                  minWidth: 56, 
                  minHeight: 56,
                  color: 'text.secondary',
                  '&:hover': { color: '#FF0000', bgcolor: 'rgba(255,0,0,0.1)' }
                }}
              >
                <YouTube sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                aria-label="Instagram"
                sx={{ 
                  minWidth: 56, 
                  minHeight: 56,
                  color: 'text.secondary',
                  '&:hover': { color: '#E4405F', bgcolor: 'rgba(228,64,95,0.1)' }
                }}
              >
                <Instagram sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                aria-label="TikTok"
                sx={{ 
                  minWidth: 56, 
                  minHeight: 56,
                  color: 'text.secondary',
                  '&:hover': { color: '#000000', bgcolor: 'rgba(0,0,0,0.1)' }
                }}
              >
                <MusicNote sx={{ fontSize: 28 }} />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                aria-label="X"
                sx={{ 
                  minWidth: 56, 
                  minHeight: 56,
                  color: 'text.secondary',
                  '&:hover': { color: '#000000', bgcolor: 'rgba(0,0,0,0.1)' }
                }}
              >
                <Twitter sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Mobile: App Store Badges */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip 
                icon={<Apple />} 
                label="Download for iOS" 
                size="medium" 
                variant="outlined"
                clickable
                sx={{ 
                  minHeight: 48,
                  '&:hover': { bgcolor: 'action.hover' },
                  '& .MuiChip-label': { fontSize: '0.9rem', fontWeight: 'bold' }
                }}
              />
              <Chip 
                icon={<Android />} 
                label="Download for Android" 
                size="medium" 
                variant="outlined"
                clickable
                sx={{ 
                  minHeight: 48,
                  '&:hover': { bgcolor: 'action.hover' },
                  '& .MuiChip-label': { fontSize: '0.9rem', fontWeight: 'bold' }
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Mobile: Copyright */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              © {new Date().getFullYear()} CreatorFlow. All rights reserved.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              Made with <Favorite sx={{ fontSize: '1em', color: 'error.main' }} /> for creators.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  // Desktop version (original 4-column layout)
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 6,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content - 4 Column Grid */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Column 1: Product & Features */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                Product & Features
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/features" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <MonetizationOn sx={{ fontSize: 16 }} />
                  Features
                </MuiLink>
                <MuiLink 
                  component={Link} 
                  href="/pricing" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Analytics sx={{ fontSize: 16 }} />
                  Pricing
                </MuiLink>
                <MuiLink 
                  component={Link} 
                  href="/integrations" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Extension sx={{ fontSize: 16 }} />
                  Integrations
                </MuiLink>
                <MuiLink 
                  component={Link} 
                  href="/api" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Code sx={{ fontSize: 16 }} />
                  API Docs
                </MuiLink>
              </Box>
              
              {/* Platform Support */}
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 3, mb: 1, color: 'text.primary' }}>
                Platform Support
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip icon={<Instagram />} label="Instagram" size="small" variant="outlined" />
                <Chip icon={<YouTube />} label="YouTube" size="small" variant="outlined" />
                <Chip icon={<MusicNote />} label="TikTok" size="small" variant="outlined" />
                <Chip icon={<Twitter />} label="X" size="small" variant="outlined" />
              </Box>
            </Box>
          </Grid>

          {/* Column 2: Company & Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                Company & Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/about" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Business sx={{ fontSize: 16 }} />
                  About Us
                </MuiLink>
                <MuiLink 
                  component={Link} 
                  href="/support" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Support sx={{ fontSize: 16 }} />
                  Support Center
                </MuiLink>
                <MuiLink 
                  component={Link} 
                  href="/blog" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Article sx={{ fontSize: 16 }} />
                  Blog & Resources
                </MuiLink>
                <MuiLink 
                  component={Link} 
                  href="/contact" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <ContactMail sx={{ fontSize: 16 }} />
                  Contact Us
                </MuiLink>
              </Box>
              
              {/* Contact Info */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                  Get in Touch
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ fontSize: 14 }} />
                    support@creatorflow.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ fontSize: 14 }} />
                    +1 (555) 123-4567
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 14 }} />
                    San Francisco, CA
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Column 3: Legal & Compliance */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                Legal & Compliance
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/privacy" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Policy sx={{ fontSize: 16 }} />
                  Privacy Policy
                </MuiLink>
                <MuiLink 
                  component={Link} 
                  href="/terms" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Description sx={{ fontSize: 16 }} />
                  Terms of Service
                </MuiLink>
                <MuiLink 
                  component={Link} 
                  href="/cookies" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Security sx={{ fontSize: 16 }} />
                  Cookie Policy
                </MuiLink>
                <MuiLink 
                  component={Link} 
                  href="/security" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Shield sx={{ fontSize: 16 }} />
                  Security
                </MuiLink>
                <MuiLink 
                  component={Link} 
                  href="/gdpr" 
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Verified sx={{ fontSize: 16 }} />
                  GDPR Compliance
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          {/* Column 4: Newsletter & Social */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                Stay Connected
              </Typography>
              
              {/* Newsletter Signup */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get the latest updates and creator tips delivered to your inbox.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Enter your email"
                    variant="outlined"
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Send />}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Subscribe
                  </Button>
                </Box>
              </Box>

              {/* Social Media */}
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Tooltip title="YouTube">
                  <IconButton
                    component="a"
                    href="#"
                    aria-label="YouTube"
                    sx={{ 
                      minWidth: 40, 
                      minHeight: 40,
                      color: 'text.secondary',
                      '&:hover': { color: '#FF0000' }
                    }}
                  >
                    <YouTube />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Instagram">
                  <IconButton
                    component="a"
                    href="#"
                    aria-label="Instagram"
                    sx={{ 
                      minWidth: 40, 
                      minHeight: 40,
                      color: 'text.secondary',
                      '&:hover': { color: '#E4405F' }
                    }}
                  >
                    <Instagram />
                  </IconButton>
                </Tooltip>
                <Tooltip title="TikTok">
                  <IconButton
                    component="a"
                    href="#"
                    aria-label="TikTok"
                    sx={{ 
                      minWidth: 40, 
                      minHeight: 40,
                      color: 'text.secondary',
                      '&:hover': { color: '#000000' }
                    }}
                  >
                    <MusicNote />
                  </IconButton>
                </Tooltip>
                <Tooltip title="X (Twitter)">
                  <IconButton
                    component="a"
                    href="#"
                    aria-label="X"
                    sx={{ 
                      minWidth: 40, 
                      minHeight: 40,
                      color: 'text.secondary',
                      '&:hover': { color: '#000000' }
                    }}
                  >
                    <Twitter />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Discord">
                  <IconButton
                    component="a"
                    href="#"
                    aria-label="Discord"
                    sx={{ 
                      minWidth: 40, 
                      minHeight: 40,
                      color: 'text.secondary',
                      '&:hover': { color: '#5865F2' }
                    }}
                  >
                    <Chat />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* App Store Badges */}
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Apple />} 
                  label="Download for iOS" 
                  size="small" 
                  variant="outlined"
                  clickable
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                />
                <Chip 
                  icon={<Android />} 
                  label="Download for Android" 
                  size="small" 
                  variant="outlined"
                  clickable
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          {/* Copyright */}
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} CreatorFlow. All rights reserved.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 0.5, mt: 0.5 }}>
              Made with <Favorite sx={{ fontSize: '1em', color: 'error.main' }} /> for creators.
            </Typography>
          </Box>

          {/* Trust Badges */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <Chip 
              icon={<Security />} 
              label="SSL Secured" 
              size="small" 
              variant="outlined"
              color="success"
            />
            <Chip 
              icon={<Verified />} 
              label="SOC 2 Compliant" 
              size="small" 
              variant="outlined"
              color="success"
            />
            <Chip 
              icon={<Shield />} 
              label="GDPR Ready" 
              size="small" 
              variant="outlined"
              color="success"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 
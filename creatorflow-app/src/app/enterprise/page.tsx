'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Search as SearchIcon,
  Security as ShieldIcon,
  Group as UsersIcon,
  Settings as SettingsIcon,
  AttachMoney as DollarSignIcon,
  Code as CodeIcon,
  Description as FileTextIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  Person as UserIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { enterpriseDocs, getEnterpriseDocsByCategory, searchEnterpriseDocs } from '@/lib/enterprise-docs';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`enterprise-tabpanel-${index}`}
      aria-labelledby={`enterprise-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EnterprisePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAudience, setFilterAudience] = useState('all');
  const [docs, setDocs] = useState(enterpriseDocs);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filter documents
  useEffect(() => {
    let filtered = enterpriseDocs;
    
    if (searchQuery) {
      filtered = searchEnterpriseDocs(searchQuery);
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === filterCategory);
    }
    
    if (filterAudience !== 'all') {
      filtered = filtered.filter(doc => doc.audience === filterAudience);
    }
    
    setDocs(filtered);
  }, [searchQuery, filterCategory, filterAudience]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'administration':
        return <SettingsIcon sx={{ fontSize: 20 }} />;
      case 'security':
        return <ShieldIcon sx={{ fontSize: 20 }} />;
      case 'compliance':
        return <CheckCircleIcon sx={{ fontSize: 20 }} />;
      case 'integration':
        return <CodeIcon sx={{ fontSize: 20 }} />;
      case 'api':
        return <CodeIcon sx={{ fontSize: 20 }} />;
      case 'billing':
        return <DollarSignIcon sx={{ fontSize: 20 }} />;
      case 'support':
        return <FileTextIcon sx={{ fontSize: 20 }} />;
      default:
        return <FileTextIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'admin':
        return 'primary';
      case 'it':
        return 'secondary';
      case 'security':
        return 'error';
      case 'finance':
        return 'success';
      case 'compliance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const categories = [
    'all',
    'administration',
    'security',
    'compliance',
    'integration',
    'api',
    'billing',
    'support'
  ];

  const audiences = [
    'all',
    'admin',
    'it',
    'security',
    'finance',
    'compliance'
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Typography color="text.primary">Enterprise Documentation</Typography>
          </Breadcrumbs>
          
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Enterprise Documentation
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Comprehensive guides for enterprise administrators, IT teams, and compliance officers
          </Typography>
          
          {/* Search and Filter */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
            <TextField
              placeholder="Search enterprise documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300, flex: 1 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Audience</InputLabel>
              <Select
                value={filterAudience}
                onChange={(e) => setFilterAudience(e.target.value)}
                label="Audience"
              >
                {audiences.map(audience => (
                  <MenuItem key={audience} value={audience}>
                    {audience === 'all' ? 'All Audiences' : audience.charAt(0).toUpperCase() + audience.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="All Documentation" 
              icon={<FileTextIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab 
              label="Administration" 
              icon={<SettingsIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab 
              label="Security & Compliance" 
              icon={<ShieldIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab 
              label="Integration & API" 
              icon={<CodeIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
          </Tabs>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* All Documentation Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {docs.map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { 
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {getCategoryIcon(doc.category)}
                      <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1, flexGrow: 1 }}>
                        {doc.title}
                      </Typography>
                      {doc.featured && (
                        <StarIcon sx={{ fontSize: 20 }} color={theme.palette.secondary.main} />
                      )}
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
                      {doc.content.substring(0, 150)}...
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={doc.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={doc.audience} 
                        size="small" 
                        color={getAudienceColor(doc.audience) as any}
                        variant="outlined" 
                      />
                      <Chip 
                        label={doc.difficulty} 
                        size="small" 
                        color={doc.difficulty === 'beginner' ? 'success' : doc.difficulty === 'intermediate' ? 'warning' : 'error'}
                        variant="outlined" 
                      />
      </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ClockIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{doc.estimatedReadTime} min</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <UserIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{doc.author}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      href={`/enterprise/doc/${doc.id}`}
                      sx={{ textTransform: 'none' }}
                    >
                      Read More
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      href={`/enterprise/doc/${doc.id}?download=true`}
                      sx={{ textTransform: 'none' }}
                    >
                      Download PDF
                      </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Administration Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            {docs.filter(doc => doc.category === 'administration').map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { 
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SettingsIcon sx={{ fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1, flexGrow: 1 }}>
                        {doc.title}
                </Typography>
                      {doc.featured && (
                        <StarIcon sx={{ fontSize: 20 }} color={theme.palette.secondary.main} />
                      )}
        </Box>
                    
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
                      {doc.content.substring(0, 150)}...
              </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={doc.audience} 
                        size="small" 
                        color={getAudienceColor(doc.audience) as any}
                        variant="outlined" 
                      />
                      <Chip 
                        label={doc.difficulty} 
                        size="small" 
                        color={doc.difficulty === 'beginner' ? 'success' : doc.difficulty === 'intermediate' ? 'warning' : 'error'}
                        variant="outlined" 
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ClockIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{doc.estimatedReadTime} min</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <UserIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{doc.author}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      href={`/enterprise/doc/${doc.id}`}
                      sx={{ textTransform: 'none' }}
                    >
                      Read More
                          </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      href={`/enterprise/doc/${doc.id}?download=true`}
                      sx={{ textTransform: 'none' }}
                    >
                      Download PDF
                          </Button>
                  </CardActions>
          </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Security & Compliance Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            {docs.filter(doc => doc.category === 'security' || doc.category === 'compliance').map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { 
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ShieldIcon sx={{ fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1, flexGrow: 1 }}>
                        {doc.title}
              </Typography>
                      {doc.featured && (
                        <StarIcon sx={{ fontSize: 20 }} color={theme.palette.secondary.main} />
                      )}
        </Box>
                    
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
                      {doc.content.substring(0, 150)}...
                </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={doc.audience} 
                        size="small" 
                        color={getAudienceColor(doc.audience) as any}
                        variant="outlined" 
                      />
                      <Chip 
                        label={doc.difficulty} 
                        size="small" 
                        color={doc.difficulty === 'beginner' ? 'success' : doc.difficulty === 'intermediate' ? 'warning' : 'error'}
                        variant="outlined" 
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ClockIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{doc.estimatedReadTime} min</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <UserIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{doc.author}</Typography>
                      </Box>
                    </Box>
              </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      href={`/enterprise/doc/${doc.id}`}
                      sx={{ textTransform: 'none' }}
                    >
                      Read More
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      href={`/enterprise/doc/${doc.id}?download=true`}
                      sx={{ textTransform: 'none' }}
                    >
                      Download PDF
                    </Button>
                  </CardActions>
            </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Integration & API Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            {docs.filter(doc => doc.category === 'integration' || doc.category === 'api').map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { 
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CodeIcon sx={{ fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1, flexGrow: 1 }}>
                        {doc.title}
                </Typography>
                      {doc.featured && (
                        <StarIcon sx={{ fontSize: 20 }} color={theme.palette.secondary.main} />
                      )}
        </Box>
                    
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
                      {doc.content.substring(0, 150)}...
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={doc.audience} 
                        size="small" 
                        color={getAudienceColor(doc.audience) as any}
                        variant="outlined" 
                      />
                      <Chip 
                        label={doc.difficulty} 
                        size="small" 
                        color={doc.difficulty === 'beginner' ? 'success' : doc.difficulty === 'intermediate' ? 'warning' : 'error'}
                        variant="outlined" 
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ClockIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{doc.estimatedReadTime} min</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <UserIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption">{doc.author}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      href={`/enterprise/doc/${doc.id}`}
                      sx={{ textTransform: 'none' }}
                    >
                      Read More
                </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      href={`/enterprise/doc/${doc.id}?download=true`}
                      sx={{ textTransform: 'none' }}
                    >
                      Download PDF
                </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  );
} 
'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Button,
  Card,
  CardHeader,

  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Paper,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Alert,
  AlertTitle,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  CircularProgress,
  Badge,
  Tooltip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Autocomplete,
  TextField,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  AppBar,
  Toolbar,
  Fab,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Breadcrumbs,
  Link,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  Slider,
  Radio,
  RadioGroup,
  FormControl,
  FormHelperText,
  Checkbox,
  Select,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Close,
  Check,
  Warning,
  Error,
  Info,
  Visibility,
  VisibilityOff,
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  ArrowDownward,
  Menu as MenuIcon,
  MoreVert,
  MoreHoriz,
  Settings,
  AccountCircle,
  Notifications,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Schedule,
  AccessTime,
  Star,
  StarBorder,
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbDown,
  Share,
  Download,
  Upload,
  Print,
  Save,
  Refresh,
  Sync,
  CloudUpload,
  CloudDownload,
  Wifi,
  SignalCellularAlt,
  BatteryFull,
  Brightness4,
  Brightness7,
  DarkMode,
  LightMode,
  Palette,
  Brush,
  Create,
  Build,
  Code,
  BugReport,
  Help,
  Support,
  Feedback,
  Report,
  Security,
  Lock,
  LockOpen,
  VpnKey,
  Key,
  Password,
  Person,
  Group,
  Business,
  Store,
  ShoppingCart,
  Payment,
  CreditCard,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  ShowChart,
  BarChart,
  PieChart,
  DonutLarge,
  DonutSmall,
  Timeline,
  Analytics,
  Assessment,
  Dashboard,
  ViewModule,
  ViewList,
  ViewComfy,
  GridView,
  ViewQuilt,
  ViewStream,
  ViewWeek,
  ViewDay,
  ViewAgenda,
  ViewCarousel,
  ViewColumn,
  ViewHeadline,
  ViewArray,
  ViewCompact,
  ViewCompactAlt,
  ViewInAr,
  ViewKanban,
  ViewTimeline,
  ViewCozy,
  ViewSidebar,
  ViewSidebarOutlined,
  ViewSidebarRounded,
  ViewSidebarSharp,
  ViewSidebarTwoTone,
} from '@mui/icons-material';

export default function MuiDemoPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [rating, setRating] = useState<number | null>(2);
  const [sliderValue, setSliderValue] = useState<number>(30);
  const [radioValue, setRadioValue] = useState('option1');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [toggleValue, setToggleValue] = useState('list');
  const [autocompleteValue, setAutocompleteValue] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(false);

  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setAccordionExpanded(isExpanded ? panel : false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        MUI Components Demo
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={
            <Switch
              checked={theme === 'dark'}
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          }
          label="Dark Mode"
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {/* Basic Components */}
        <Box>
          <Card>
            <CardHeader>
              <Typography variant="h6" gutterBottom>
                Basic Components
              </Typography>
              <Typography variant="body2">Essential MUI components</Typography>
            </CardHeader>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Buttons
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Button variant="default">Default</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Input Fields
                  </Typography>
                  <Stack spacing={2}>
                    <Input placeholder="Basic input" />
                    <Input placeholder="With label" label="Label" />
                    <Input placeholder="With helper text" label="Helper Text" helperText="This is helper text" />
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Icons & Avatars
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>
                      <Person />
                    </Avatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <AccountCircle />
                    </Avatar>
                    <IconButton color="primary">
                      <Settings />
                    </IconButton>
                    <IconButton color="secondary">
                      <Notifications />
                    </IconButton>
                    <Badge badgeContent={4} color="error">
                      <IconButton>
                        <Email />
                      </IconButton>
                    </Badge>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Interactive Components */}
        <Box>
          <Card>
            <CardHeader>
              <Typography variant="h6" gutterBottom>
                Interactive Components
              </Typography>
              <Typography variant="body2">Components with state</Typography>
            </CardHeader>
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Rating
                  </Typography>
                  <Rating
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Slider
                  </Typography>
                  <Slider
                    value={sliderValue}
                    onChange={(event, newValue) => setSliderValue(newValue as number)}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Radio Buttons
                  </Typography>
                  <RadioGroup
                    value={radioValue}
                    onChange={(event) => setRadioValue(event.target.value)}
                  >
                    <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
                    <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
                    <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
                  </RadioGroup>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Checkbox & Switch
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkboxValue}
                          onChange={(event) => setCheckboxValue(event.target.checked)}
                        />
                      }
                      label="Checkbox"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={checkboxValue}
                          onChange={(event) => setCheckboxValue(event.target.checked)}
                        />
                      }
                      label="Switch"
                    />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Data Display */}
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardHeader>
            <Typography variant="h6" gutterBottom>
              Data Display Components
            </Typography>
            <Typography variant="body2">Tables, lists, and data visualization</Typography>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Table" />
              <Tab label="List" />
              <Tab label="Chips" />
              <Tab label="Progress" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
              {activeTab === 0 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>John Doe</TableCell>
                        <TableCell>john@example.com</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>
                          <Chip label="Active" color="success" size="small" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>jane@example.com</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>
                          <Chip label="Pending" color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {activeTab === 1 && (
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary="User Profile" secondary="Manage your account settings" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText primary="Settings" secondary="Configure application preferences" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText primary="Security" secondary="Update password and security settings" />
                  </ListItem>
                </List>
              )}

              {activeTab === 2 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label="Default" />
                  <Chip label="Primary" color="primary" />
                  <Chip label="Secondary" color="secondary" />
                  <Chip label="Success" color="success" />
                  <Chip label="Warning" color="warning" />
                  <Chip label="Error" color="error" />
                  <Chip label="Deletable" onDelete={() => {}} />
                  <Chip label="Clickable" onClick={() => {}} />
                </Stack>
              )}

              {activeTab === 3 && (
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Linear Progress
                    </Typography>
                    <LinearProgress variant="determinate" value={70} />
                  </Box>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Circular Progress
                    </Typography>
                    <CircularProgress variant="determinate" value={70} />
                  </Box>
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Skeleton Loading
                    </Typography>
                    <Stack spacing={1}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="rectangular" height={60} />
                    </Stack>
                  </Box>
                </Stack>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Navigation & Layout */}
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardHeader>
            <Typography variant="h6" gutterBottom>
              Navigation & Layout
            </Typography>
            <Typography variant="body2">Menus, drawers, and navigation components</Typography>
          </CardHeader>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Breadcrumbs
                </Typography>
                <Breadcrumbs>
                  <Link href="#" color="inherit">
                    Home
                  </Link>
                  <Link href="#" color="inherit">
                    Dashboard
                  </Link>
                  <Typography color="text.primary">Current Page</Typography>
                </Breadcrumbs>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Toggle Buttons
                </Typography>
                <ToggleButtonGroup
                  value={toggleValue}
                  exclusive
                  onChange={(event, newValue) => setToggleValue(newValue)}
                >
                  <ToggleButton value="list">
                    <ViewList />
                  </ToggleButton>
                  <ToggleButton value="grid">
                    <GridView />
                  </ToggleButton>
                  <ToggleButton value="module">
                    <ViewModule />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Stepper
                </Typography>
                <Stepper activeStep={activeStep} orientation="vertical">
                  <Step>
                    <StepLabel>Step 1</StepLabel>
                    <StepContent>
                      <Typography>This is step 1 content</Typography>
                      <Box sx={{ mb: 2 }}>
                        <Button variant="default" onClick={handleNext}>
                          Continue
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Step 2</StepLabel>
                    <StepContent>
                      <Typography>This is step 2 content</Typography>
                      <Box sx={{ mb: 2 }}>
                        <Button variant="default" onClick={handleNext}>
                          Continue
                        </Button>
                        <Button variant="outline" onClick={handleBack}>
                          Back
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Step 3</StepLabel>
                    <StepContent>
                      <Typography>This is step 3 content</Typography>
                      <Box sx={{ mb: 2 }}>
                        <Button variant="outline" onClick={handleBack}>
                          Back
                        </Button>
                        <Button variant="default" onClick={handleReset}>
                          Reset
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                </Stepper>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Accordion
                </Typography>
                <Accordion expanded={accordionExpanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
                  <AccordionSummary expandIcon={<ArrowDownward />}>
                    <Typography>Accordion 1</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      This is the content of accordion 1.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={accordionExpanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
                  <AccordionSummary expandIcon={<ArrowDownward />}>
                    <Typography>Accordion 2</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      This is the content of accordion 2.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Feedback Components */}
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardHeader>
            <Typography variant="h6" gutterBottom>
              Feedback Components
            </Typography>
            <Typography variant="body2">Alerts, dialogs, and notifications</Typography>
          </CardHeader>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Alerts
                </Typography>
                <Stack spacing={1}>
                  <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    This is a success alert.
                  </Alert>
                  <Alert severity="info">
                    <AlertTitle>Info</AlertTitle>
                    This is an info alert.
                  </Alert>
                  <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    This is a warning alert.
                  </Alert>
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    This is an error alert.
                  </Alert>
                </Stack>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Buttons for Dialogs & Menus
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="default" onClick={() => setDialogOpen(true)}>
                    Open Dialog
                  </Button>
                  <Button variant="outline" onClick={(event) => setMenuAnchor(event.currentTarget)}>
                    Open Menu
                  </Button>
                  <Button variant="secondary" onClick={() => setSnackbarOpen(true)}>
                    Show Snackbar
                  </Button>
                </Stack>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Floating Action Button
                </Typography>
                <Fab color="primary" aria-label="add">
                  <Add />
                </Fab>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Dialogs and Menus */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogContent>
          <Typography>
            This is the content of the dialog.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="default" onClick={() => setDialogOpen(false)}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>Profile</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>My account</MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>Logout</MenuItem>
      </Menu>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="This is a snackbar message"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Drawer Content
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Container>
  );
} 
'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Paper,
  Divider,
  Grid,
  FormControl,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Slider,
  Rating,
  Chip,
  Alert,
  Button,
  TextField,
  Autocomplete,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  MuiSelect,
  MuiCheckbox,
  MuiSwitch,
  DataTable,
  Input,
} from '@/components/ui/mui-components';
import {
  ExpandMore,
  Person,
  Email,
  Phone,
  CalendarToday,
  LocationOn,
  Work,
  School,
  Favorite,
  Star,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  experience: string;
  skills: string[];
  newsletter: boolean;
  notifications: boolean;
  theme: string;
  rating: number | null;
  salary: number;
  location: string;
  startDate: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  experience: '',
  skills: [],
  newsletter: false,
  notifications: true,
  theme: 'light',
  rating: 0,
  salary: 50000,
  location: '',
  startDate: '',
};

const skillsOptions = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C++',
  'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD',
  'UI/UX Design', 'Product Management', 'Agile', 'Scrum'
];

const experienceOptions = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6-10 years)' },
  { value: 'lead', label: 'Lead/Manager (10+ years)' },
];

const themeOptions = [
  { value: 'light', label: 'Light Theme' },
  { value: 'dark', label: 'Dark Theme' },
  { value: 'auto', label: 'System Default' },
];

// Sample data for the data table
const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    position: 'Senior Developer',
    department: 'Engineering',
    salary: 85000,
    startDate: '2023-01-15',
    active: true,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    position: 'Product Manager',
    department: 'Product',
    salary: 95000,
    startDate: '2022-08-20',
    active: true,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    position: 'Designer',
    department: 'Design',
    salary: 75000,
    startDate: '2023-03-10',
    active: false,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    position: 'Marketing Specialist',
    department: 'Marketing',
    salary: 65000,
    startDate: '2022-11-05',
    active: true,
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

const tableColumns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'position', label: 'Position', minWidth: 150 },
  { id: 'department', label: 'Department', minWidth: 120 },
  { id: 'salary', label: 'Salary', minWidth: 100, align: 'right' as const },
  { id: 'startDate', label: 'Start Date', minWidth: 120 },
  { id: 'active', label: 'Status', minWidth: 100 },
];

export default function MuiFormsDemo() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted! Check console for data.');
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        MUI Forms & Data Components Demo
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive showcase of MUI form components and data display features.
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Basic Forms" />
        <Tab label="Advanced Forms" />
        <Tab label="Data Table" />
        <Tab label="Form Validation" />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Basic Form Components
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />

              <MuiSelect
                fullWidth
                label="Experience Level"
                options={experienceOptions}
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
              />

              <Autocomplete
                multiple
                options={skillsOptions}
                value={formData.skills}
                onChange={(e, newValue) => handleInputChange('skills', newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Skills" placeholder="Select skills" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
              />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Preferences
                </Typography>
                <Stack direction="row" spacing={3}>
                  <MuiCheckbox
                    label="Subscribe to newsletter"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                  />
                  <MuiSwitch
                    label="Enable notifications"
                    checked={formData.notifications}
                    onChange={(e) => handleInputChange('notifications', e.target.checked)}
                  />
                </Stack>
              </Box>

              <Button type="submit" variant="contained" size="large">
                Submit Form
              </Button>
            </Stack>
          </form>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Advanced Form Components
          </Typography>
          
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                />
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Theme Preference
              </Typography>
              <RadioGroup
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
              >
                {themeOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Rating
              </Typography>
              <Rating
                value={formData.rating}
                onChange={(e, newValue) => handleInputChange('rating', newValue)}
                size="large"
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Salary Range: ${formData.salary.toLocaleString()}
              </Typography>
              <Slider
                value={formData.salary}
                onChange={(e, newValue) => handleInputChange('salary', newValue)}
                min={30000}
                max={150000}
                step={5000}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value.toLocaleString()}`}
              />
            </Box>

            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Data Table Component
          </Typography>
          
          <DataTable
            data={sampleData}
            columns={tableColumns}
            title="Employee Directory"
            selectable
            searchable
            pagination
            actions={{
              view: (row) => console.log('View:', row),
              edit: (row) => console.log('Edit:', row),
              delete: (row) => console.log('Delete:', row),
            }}
            onSelectionChange={(selected) => console.log('Selected:', selected)}
          />
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Form Validation & Feedback
          </Typography>
          
          <Stack spacing={3}>
            <Alert severity="info">
              This section demonstrates form validation and user feedback patterns.
            </Alert>

            <Accordion
              expanded={expandedAccordion === 'validation'}
              onChange={handleAccordionChange('validation')}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Validation Examples</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <TextField
                    label="Email (with validation)"
                    type="email"
                    error={formData.email && !formData.email.includes('@')}
                    helperText={formData.email && !formData.email.includes('@') ? 'Please enter a valid email' : ''}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  
                  <TextField
                    label="Phone (with validation)"
                    type="tel"
                    error={formData.phone && formData.phone.length < 10}
                    helperText={formData.phone && formData.phone.length < 10 ? 'Please enter a valid phone number' : ''}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expandedAccordion === 'feedback'}
              onChange={handleAccordionChange('feedback')}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">User Feedback</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Alert severity="success">
                    Form submitted successfully!
                  </Alert>
                  <Alert severity="warning">
                    Please review your information before submitting.
                  </Alert>
                  <Alert severity="error">
                    There was an error processing your request.
                  </Alert>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Paper>
      )}
    </Container>
  );
} 
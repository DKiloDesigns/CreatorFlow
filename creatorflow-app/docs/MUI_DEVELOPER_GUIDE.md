# MUI Developer Guide

## Quick Start

This guide helps developers work with the CreatorFlow MUI component library effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Component Patterns](#component-patterns)
3. [Styling Guidelines](#styling-guidelines)
4. [Common Patterns](#common-patterns)
5. [Troubleshooting](#troubleshooting)
6. [Performance Tips](#performance-tips)

---

## Getting Started

### Installation

The MUI components are already installed and configured. No additional setup required.

### Basic Usage

```tsx
import { Button, Card, Typography } from '@/components/ui';

function MyComponent() {
  return (
    <Card>
      <Typography variant="h5">Hello World</Typography>
      <Button variant="contained" color="primary">
        Click me
      </Button>
    </Card>
  );
}
```

---

## Component Patterns

### 1. Layout Components

#### Container Pattern
```tsx
import { Container, Grid, Box } from '@/components/ui';

function Layout() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            Content 1
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            Content 2
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
```

#### Card Layout Pattern
```tsx
import { Card, CardHeader, CardContent, CardActions } from '@/components/ui';

function CardExample() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title="Card Title"
        subheader="Card Subtitle"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Card content goes here
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Action 1</Button>
        <Button size="small">Action 2</Button>
      </CardActions>
    </Card>
  );
}
```

### 2. Form Components

#### Form with Validation
```tsx
import { useState } from 'react';
import { Box, TextField, Button, Alert } from '@/components/ui';

function FormExample() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    // Submit logic
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={!!errors.email}
        helperText={errors.email}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
    </Box>
  );
}
```

#### Select with Options
```tsx
import { FormControl, InputLabel, Select, MenuItem } from '@/components/ui';

function SelectExample() {
  const [value, setValue] = useState('');

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Age"
        onChange={(e) => setValue(e.target.value)}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
}
```

### 3. Navigation Components

#### Tab Navigation
```tsx
import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@/components/ui';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function TabExample() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Item One" />
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
}
```

---

## Styling Guidelines

### 1. Using the sx Prop

The `sx` prop is the primary way to style MUI components:

```tsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
  }}
>
  Content
</Box>
```

### 2. Responsive Design

Use breakpoint objects for responsive styling:

```tsx
<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 1, md: 2 },
    p: { xs: 1, sm: 2, md: 3 },
  }}
>
  Content
</Box>
```

### 3. Theme Integration

Use theme values for consistent styling:

```tsx
<Box
  sx={{
    color: 'primary.main',
    bgcolor: 'background.default',
    border: 1,
    borderColor: 'divider',
    '&:hover': {
      bgcolor: 'action.hover',
    },
  }}
>
  Content
</Box>
```

### 4. Conditional Styling

Use functions for dynamic styling:

```tsx
<Box
  sx={(theme) => ({
    p: 2,
    bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
    color: theme.palette.mode === 'dark' ? 'white' : 'black',
  })}
>
  Content
</Box>
```

---

## Common Patterns

### 1. Loading States

```tsx
import { CircularProgress, Backdrop } from '@/components/ui';

function LoadingExample() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button onClick={() => setLoading(true)}>
        Load Data
      </Button>
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
```

### 2. Error Handling

```tsx
import { Alert, Snackbar } from '@/components/ui';

function ErrorExample() {
  const [error, setError] = useState(null);

  const handleClose = () => setError(null);

  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {error}
      </Alert>
    </Snackbar>
  );
}
```

### 3. Data Display

```tsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@/components/ui';

function DataTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```

---

## Troubleshooting

### Common Issues

#### 1. Styling Not Applied
```tsx
// ❌ Wrong - className doesn't work with MUI
<Box className="flex items-center">

// ✅ Correct - use sx prop
<Box sx={{ display: 'flex', alignItems: 'center' }}>
```

#### 2. Theme Not Working
```tsx
// ❌ Wrong - hardcoded colors
<Box sx={{ color: '#1976d2' }}>

// ✅ Correct - use theme values
<Box sx={{ color: 'primary.main' }}>
```

#### 3. Responsive Issues
```tsx
// ❌ Wrong - fixed values
<Box sx={{ width: 300, height: 200 }}>

// ✅ Correct - responsive values
<Box sx={{ width: { xs: '100%', md: 300 }, height: { xs: 'auto', md: 200 } }}>
```

### Debug Tips

1. **Use Browser DevTools**: Inspect MUI components to see applied styles
2. **Check Theme**: Verify theme values are correct
3. **Test Responsive**: Test on different screen sizes
4. **Validate Props**: Ensure all required props are provided

---

## Performance Tips

### 1. Memoization

```tsx
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Expensive rendering logic
  return <div>{data}</div>;
});
```

### 2. Lazy Loading

```tsx
import { lazy, Suspense } from 'react';
import { CircularProgress } from '@/components/ui';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 3. Optimize sx Prop

```tsx
// ❌ Wrong - inline object creation
<Box sx={{ display: 'flex', alignItems: 'center' }}>

// ✅ Correct - extract to variable
const styles = { display: 'flex', alignItems: 'center' };
<Box sx={styles}>
```

### 4. Use Theme Breakpoints

```tsx
// ❌ Wrong - hardcoded breakpoints
<Box sx={{ display: { xs: 'none', md: 'block' } }}>

// ✅ Correct - use theme breakpoints
<Box sx={{ display: { xs: 'none', md: 'block' } }}>
```

---

## Best Practices

1. **Consistency**: Use the same component variants throughout
2. **Accessibility**: Include proper ARIA labels and semantic HTML
3. **Performance**: Use `sx` prop efficiently, avoid inline objects
4. **Responsive**: Design mobile-first with responsive breakpoints
5. **Theme**: Use theme values instead of hardcoded values
6. **Testing**: Test components across different screen sizes and themes
7. **Documentation**: Document custom components and their usage

---

*Last updated: September 6, 2025*
*Version: 1.0.0*

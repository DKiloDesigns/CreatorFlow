# CreatorFlow MUI Component Library

## Overview

This document provides comprehensive documentation for the CreatorFlow Material-UI (MUI) component library. All components have been converted from Tailwind CSS to MUI for better consistency, theming, and maintainability.

## Table of Contents

1. [Core Components](#core-components)
2. [Layout Components](#layout-components)
3. [Form Components](#form-components)
4. [Navigation Components](#navigation-components)
5. [Feedback Components](#feedback-components)
6. [AI Components](#ai-components)
7. [Theme System](#theme-system)
8. [Usage Guidelines](#usage-guidelines)
9. [Migration Guide](#migration-guide)

---

## Core Components

### Button (`mui-button.tsx`)

A comprehensive button component with multiple variants and states.

```tsx
import { Button } from '@/components/ui/mui-button';

// Basic usage
<Button variant="contained" color="primary">
  Click me
</Button>

// With different variants
<Button variant="outlined" color="secondary">
  Outlined Button
</Button>

<Button variant="text" color="error">
  Text Button
</Button>
```

**Props:**
- `variant`: 'contained' | 'outlined' | 'text'
- `color`: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `fullWidth`: boolean

### Card (`mui-card.tsx`)

Flexible card component for content organization.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/mui-card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Typography (`mui-typography.tsx`)

Consistent text styling component.

```tsx
import { Typography } from '@/components/ui/mui-typography';

<Typography variant="h1" component="h1">
  Main Heading
</Typography>

<Typography variant="body1" color="text.secondary">
  Body text with secondary color
</Typography>
```

---

## Layout Components

### Container (`layout/Container/index.tsx`)

Responsive container component with consistent spacing.

```tsx
import { Container } from '@/components/ui/layout/Container';

<Container maxWidth="lg">
  <Typography variant="h4">Page Content</Typography>
</Container>
```

### Grid (`layout/Grid/index.tsx`)

Flexible grid system for responsive layouts.

```tsx
import { Grid } from '@/components/ui/layout/Grid';

<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <Card>Content 1</Card>
  </Grid>
  <Grid item xs={12} md={6}>
    <Card>Content 2</Card>
  </Grid>
</Grid>
```

### Divider (`layout/Divider.tsx`)

Visual separator component.

```tsx
import { Divider } from '@/components/ui/layout/Divider';

<Divider />
<Divider variant="middle" />
<Divider orientation="vertical" />
```

---

## Form Components

### Input (`mui-input.tsx`)

Enhanced input component with validation states.

```tsx
import { Input } from '@/components/ui/mui-input';

<Input
  label="Email"
  type="email"
  required
  error={!!errors.email}
  helperText={errors.email?.message}
/>
```

### Select (`mui-select.tsx`)

Dropdown selection component.

```tsx
import { Select, MenuItem } from '@/components/ui/mui-select';

<Select
  value={value}
  onChange={handleChange}
  label="Select Option"
>
  <MenuItem value="option1">Option 1</MenuItem>
  <MenuItem value="option2">Option 2</MenuItem>
</Select>
```

### Switch (`mui-switch.tsx`)

Toggle switch component.

```tsx
import { Switch } from '@/components/ui/mui-switch';

<Switch
  checked={isEnabled}
  onChange={handleToggle}
  color="primary"
/>
```

### Checkbox (`mui-checkbox.tsx`)

Checkbox input component.

```tsx
import { Checkbox } from '@/components/ui/mui-checkbox';

<Checkbox
  checked={isChecked}
  onChange={handleChange}
  color="primary"
/>
```

---

## Navigation Components

### Tabs (`navigation/Tabs.tsx`)

Tab navigation component.

```tsx
import { Tabs, Tab } from '@/components/ui/navigation/Tabs';

<Tabs value={activeTab} onChange={handleTabChange}>
  <Tab label="Tab 1" />
  <Tab label="Tab 2" />
  <Tab label="Tab 3" />
</Tabs>
```

### Pagination (`navigation/Pagination.tsx`)

Pagination component for data tables.

```tsx
import { Pagination } from '@/components/ui/navigation/Pagination';

<Pagination
  count={totalPages}
  page={currentPage}
  onChange={handlePageChange}
  color="primary"
/>
```

### Breadcrumb (`navigation/Breadcrumb.tsx`)

Navigation breadcrumb component.

```tsx
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Current Page' }
  ]}
/>
```

---

## Feedback Components

### Alert (`feedback/Alert.tsx`)

Alert notification component.

```tsx
import { Alert } from '@/components/ui/feedback/Alert';

<Alert severity="success">
  Operation completed successfully!
</Alert>

<Alert severity="error" variant="outlined">
  An error occurred
</Alert>
```

### Progress (`feedback/Progress.tsx`)

Progress indicator component.

```tsx
import { Progress } from '@/components/ui/feedback/Progress';

<Progress
  value={75}
  variant="determinate"
  color="primary"
  showValue
  label="Upload Progress"
/>
```

### Badge (`feedback/Badge.tsx`)

Badge component for notifications and labels.

```tsx
import { Badge } from '@/components/ui/feedback/Badge';

<Badge badgeContent={4} color="primary">
  <Button>Notifications</Button>
</Badge>
```

---

## AI Components

### AI Provider Selector (`ai-provider-selector.tsx`)

Component for selecting AI service providers.

```tsx
import { AIProviderSelector } from '@/components/ui/ai-provider-selector';

<AIProviderSelector
  selectedProvider={selectedProvider}
  onProviderSelect={handleProviderSelect}
  onSetupProvider={handleSetupProvider}
/>
```

### Content Performance Predictor (`content-performance-predictor.tsx`)

AI-powered content performance prediction.

```tsx
import { ContentPerformancePredictor } from '@/components/ui/content-performance-predictor';

<ContentPerformancePredictor
  onPredictionComplete={handlePrediction}
  targetAudience="tech professionals"
  industry="software"
/>
```

### Smart Caption Generator (`smart-caption-generator.tsx`)

AI-powered caption generation with multiple variants.

```tsx
import { SmartCaptionGenerator } from '@/components/ui/smart-caption-generator';

<SmartCaptionGenerator
  onCaptionGenerated={handleCaptionGenerated}
  contentType="social media"
  platform="instagram"
/>
```

---

## Theme System

### Theme Customization

The MUI theme system provides consistent styling across all components.

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### Color System

- **Primary**: Main brand color
- **Secondary**: Accent color
- **Error**: Error states
- **Warning**: Warning states
- **Info**: Information states
- **Success**: Success states

### Typography Scale

- `h1` - h6: Heading variants
- `subtitle1`, `subtitle2`: Subtitle variants
- `body1`, `body2`: Body text variants
- `caption`: Small text
- `overline`: Uppercase text

---

## Usage Guidelines

### 1. Import Components

Always import components from their specific paths:

```tsx
// ✅ Correct
import { Button } from '@/components/ui/mui-button';
import { Card } from '@/components/ui/mui-card';

// ❌ Avoid
import { Button } from '@mui/material';
```

### 2. Use sx Prop for Styling

Prefer the `sx` prop over `className` for styling:

```tsx
// ✅ Correct
<Box sx={{ display: 'flex', gap: 2, p: 2 }}>
  Content
</Box>

// ❌ Avoid
<Box className="flex gap-2 p-2">
  Content
</Box>
```

### 3. Responsive Design

Use MUI's responsive breakpoint system:

```tsx
<Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: { xs: 1, md: 2 }
}}>
  Content
</Box>
```

### 4. Theme Integration

Use theme values for consistent styling:

```tsx
<Box sx={{
  color: 'primary.main',
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider'
}}>
  Content
</Box>
```

---

## Migration Guide

### From Tailwind to MUI

#### Before (Tailwind):
```tsx
<div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

#### After (MUI):
```tsx
<Box sx={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  p: 2,
  bgcolor: 'grey.100',
  borderRadius: 2
}}>
  <Typography variant="h5" sx={{ fontWeight: 600, color: 'grey.900' }}>
    Title
  </Typography>
  <Button
    variant="contained"
    color="primary"
    sx={{ px: 2, py: 1 }}
  >
    Action
  </Button>
</Box>
```

### Common Conversions

| Tailwind Class | MUI sx Prop |
|----------------|-------------|
| `flex` | `display: 'flex'` |
| `items-center` | `alignItems: 'center'` |
| `justify-between` | `justifyContent: 'space-between'` |
| `p-4` | `p: 2` |
| `bg-gray-100` | `bgcolor: 'grey.100'` |
| `rounded-lg` | `borderRadius: 2` |
| `text-xl` | `fontSize: '1.25rem'` |
| `font-semibold` | `fontWeight: 600` |

---

## Best Practices

1. **Consistency**: Use the same component variants throughout the app
2. **Accessibility**: Always include proper ARIA labels and semantic HTML
3. **Performance**: Use `sx` prop for dynamic styling, avoid inline styles
4. **Responsive**: Design mobile-first with responsive breakpoints
5. **Theme**: Use theme values instead of hardcoded colors/spacing
6. **Testing**: Test components across different screen sizes and themes

---

## Component Status

| Component | Status | MUI Conversion | Documentation |
|-----------|--------|----------------|---------------|
| Button | ✅ Complete | 100% | ✅ Complete |
| Card | ✅ Complete | 100% | ✅ Complete |
| Typography | ✅ Complete | 100% | ✅ Complete |
| Container | ✅ Complete | 100% | ✅ Complete |
| Grid | ✅ Complete | 100% | ✅ Complete |
| Input | ✅ Complete | 100% | ✅ Complete |
| Select | ✅ Complete | 100% | ✅ Complete |
| Switch | ✅ Complete | 100% | ✅ Complete |
| Tabs | ✅ Complete | 100% | ✅ Complete |
| Pagination | ✅ Complete | 100% | ✅ Complete |
| Alert | ✅ Complete | 100% | ✅ Complete |
| Progress | ✅ Complete | 100% | ✅ Complete |
| Badge | ✅ Complete | 100% | ✅ Complete |

---

*Last updated: September 6, 2025*
*Version: 1.0.0*

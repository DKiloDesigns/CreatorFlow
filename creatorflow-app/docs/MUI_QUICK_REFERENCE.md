# MUI Quick Reference

## 🚀 Quick Start

```tsx
import { Button, Card, Typography, Box } from '@/components/ui';

function MyComponent() {
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5">Hello World</Typography>
      <Button variant="contained" color="primary">
        Click me
      </Button>
    </Card>
  );
}
```

## 📦 Common Imports

```tsx
// Layout
import { Container, Grid, Box, Stack } from '@/components/ui';

// Form
import { TextField, Select, Switch, Checkbox, Button } from '@/components/ui';

// Display
import { Card, Typography, Chip, Badge, Avatar } from '@/components/ui';

// Navigation
import { Tabs, Pagination, Breadcrumb } from '@/components/ui';

// Feedback
import { Alert, Progress, Snackbar } from '@/components/ui';
```

## 🎨 Common Patterns

### Layout
```tsx
<Container maxWidth="lg">
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Card>Content</Card>
    </Grid>
  </Grid>
</Container>
```

### Form
```tsx
<Box component="form" sx={{ mt: 1 }}>
  <TextField
    margin="normal"
    required
    fullWidth
    label="Email"
    autoComplete="email"
  />
  <Button type="submit" fullWidth variant="contained">
    Submit
  </Button>
</Box>
```

### Card
```tsx
<Card sx={{ maxWidth: 345 }}>
  <CardHeader title="Title" subheader="Subtitle" />
  <CardContent>
    <Typography variant="body2">Content</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Action</Button>
  </CardActions>
</Card>
```

## 🎯 sx Prop Cheat Sheet

### Layout
```tsx
sx={{
  display: 'flex',           // flex, block, none, grid
  flexDirection: 'column',   // row, column, row-reverse, column-reverse
  alignItems: 'center',      // flex-start, center, flex-end, stretch
  justifyContent: 'center',  // flex-start, center, flex-end, space-between
  gap: 2,                    // 0, 0.5, 1, 1.5, 2, 3, 4
}}
```

### Spacing
```tsx
sx={{
  p: 2,        // padding: 16px
  px: 2,       // paddingX: 16px
  py: 1,       // paddingY: 8px
  m: 2,        // margin: 16px
  mx: 'auto',  // marginX: auto
  mt: 3,       // marginTop: 24px
}}
```

### Colors
```tsx
sx={{
  color: 'primary.main',        // primary, secondary, error, warning, info, success
  bgcolor: 'background.paper',  // background.default, grey.50, grey.100
  borderColor: 'divider',       // divider, grey.300
}}
```

### Typography
```tsx
sx={{
  fontSize: '1.25rem',    // 0.75rem, 0.875rem, 1rem, 1.125rem, 1.25rem
  fontWeight: 600,        // 300, 400, 500, 600, 700
  lineHeight: 1.5,        // 1, 1.2, 1.5, 1.75, 2
  textAlign: 'center',    // left, center, right, justify
}}
```

### Responsive
```tsx
sx={{
  display: { xs: 'none', md: 'block' },
  fontSize: { xs: '1rem', md: '1.25rem' },
  p: { xs: 1, sm: 2, md: 3 },
}}
```

## 🔧 Common Components

### Button Variants
```tsx
<Button variant="contained" color="primary">Primary</Button>
<Button variant="outlined" color="secondary">Secondary</Button>
<Button variant="text" color="error">Text</Button>
```

### Typography Variants
```tsx
<Typography variant="h1">Heading 1</Typography>
<Typography variant="h6">Heading 6</Typography>
<Typography variant="body1">Body 1</Typography>
<Typography variant="body2">Body 2</Typography>
<Typography variant="caption">Caption</Typography>
```

### Alert Types
```tsx
<Alert severity="success">Success message</Alert>
<Alert severity="error">Error message</Alert>
<Alert severity="warning">Warning message</Alert>
<Alert severity="info">Info message</Alert>
```

## 📱 Responsive Breakpoints

```tsx
// xs: 0px+
// sm: 600px+
// md: 900px+
// lg: 1200px+
// xl: 1536px+

sx={{
  width: { xs: '100%', sm: '50%', md: '33%' },
  display: { xs: 'none', md: 'block' },
}}
```

## 🎨 Theme Colors

```tsx
// Primary
'primary.main'     // #1976d2
'primary.light'    // #42a5f5
'primary.dark'     // #1565c0

// Secondary
'secondary.main'   // #dc004e
'secondary.light'  // #ff5983
'secondary.dark'   // #9a0036

// Text
'text.primary'     // rgba(0, 0, 0, 0.87)
'text.secondary'   // rgba(0, 0, 0, 0.6)
'text.disabled'    // rgba(0, 0, 0, 0.38)

// Background
'background.default' // #fafafa
'background.paper'   // #ffffff
```

## ⚡ Performance Tips

1. **Extract sx objects**:
```tsx
// ✅ Good
const styles = { display: 'flex', gap: 2 };
<Box sx={styles}>

// ❌ Avoid
<Box sx={{ display: 'flex', gap: 2 }}>
```

2. **Use theme values**:
```tsx
// ✅ Good
sx={{ color: 'primary.main' }}

// ❌ Avoid
sx={{ color: '#1976d2' }}
```

3. **Memoize expensive components**:
```tsx
const ExpensiveComponent = memo(({ data }) => {
  return <div>{data}</div>;
});
```

## 🐛 Common Issues

### Styling not applied
- Use `sx` prop instead of `className`
- Check theme values are correct

### Responsive not working
- Use MUI breakpoint system
- Test on different screen sizes

### Theme not working
- Use theme values instead of hardcoded colors
- Check ThemeProvider is wrapping components

---

*Quick Reference v1.0.0 - September 6, 2025*

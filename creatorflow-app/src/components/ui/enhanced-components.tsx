/**
 * Enhanced UI Components
 * Polished and enhanced UI components with animations and better UX
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  Paper,
  Chip,
  Avatar,
  Badge,
  LinearProgress,
  CircularProgress,
  Skeleton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Breadcrumbs,
  Link,
  Drawer,
  AppBar,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  createTheme,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Flag as FlagIcon,
  FlagOutlined as FlagOutlinedIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,
  Replay as ReplayIcon,
  FastForward as FastForwardIcon,
  FastRewind as FastRewindIcon,
  VolumeUp as VolumeUpIcon,
  VolumeDown as VolumeDownIcon,
  VolumeOff as VolumeOffIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Flip as FlipIcon,
  Crop as CropIcon,
  Adjust as AdjustIcon,
  Palette as PaletteIcon,
  Brush as BrushIcon,
  FormatPaint as FormatPaintIcon,
  ColorLens as ColorLensIcon,
  Gradient as GradientIcon,
  Opacity as OpacityIcon,
  BlurOn as BlurOnIcon,
  BlurOff as BlurOffIcon,
  AutoFixHigh as AutoFixHighIcon,
  AutoFixNormal as AutoFixNormalIcon,
  AutoFixOff as AutoFixOffIcon,
  AutoAwesome as AutoAwesomeIcon,
  AutoAwesomeMotion as AutoAwesomeMotionIcon,
  AutoAwesomeMosaic as AutoAwesomeMosaicIcon,
  AutoStories as AutoStoriesIcon,
  AutoDelete as AutoDeleteIcon,
  AutoMode as AutoModeIcon,
  AutoGraph as AutoGraphIcon,
  AutoFixHigh as AutoFixHighIcon2,
  AutoFixNormal as AutoFixNormalIcon2,
  AutoFixOff as AutoFixOffIcon2,
  AutoAwesome as AutoAwesomeIcon2,
  AutoAwesomeMotion as AutoAwesomeMotionIcon2,
  AutoAwesomeMosaic as AutoAwesomeMosaicIcon2,
  AutoStories as AutoStoriesIcon2,
  AutoDelete as AutoDeleteIcon2,
  AutoMode as AutoModeIcon2,
  AutoGraph as AutoGraphIcon2,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Button Component
export function EnhancedButton({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  className,
  sx,
  ...props
}: any) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsPressed(false)}
      onHoverEnd={() => setIsPressed(false)}
      onTapStart={() => setIsPressed(true)}
      onTapEnd={() => setIsPressed(false)}
    >
      <Button
        variant={variant}
        color={color}
        size={size}
        disabled={disabled || loading}
        startIcon={loading ? <CircularProgress size={16} /> : startIcon}
        endIcon={endIcon}
        onClick={onClick}
        className={className}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          ...sx,
        }}
        {...props}
      >
        {children}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <CircularProgress size={20} />
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
}

// Enhanced Card Component
export function EnhancedCard({
  children,
  hover = true,
  elevation = 1,
  onClick,
  className,
  sx,
  ...props
}: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        elevation={isHovered && hover ? elevation + 2 : elevation}
        onClick={onClick}
        className={className}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
}

// Enhanced TextField Component
export function EnhancedTextField({
  label,
  value,
  onChange,
  error = false,
  helperText,
  loading = false,
  startIcon,
  endIcon,
  className,
  sx,
  ...props
}: any) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      whileFocus={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        disabled={loading}
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position="start">
              {loading ? <CircularProgress size={20} /> : startIcon}
            </InputAdornment>
          ) : undefined,
          endAdornment: endIcon ? (
            <InputAdornment position="end">
              {endIcon}
            </InputAdornment>
          ) : undefined,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={className}
        sx={{
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isFocused ? 'primary.main' : 'text.secondary',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
          ...sx,
        }}
        {...props}
      />
    </motion.div>
  );
}

// Enhanced Chip Component
export function EnhancedChip({
  label,
  color = 'default',
  variant = 'filled',
  size = 'medium',
  onDelete,
  onClick,
  className,
  sx,
  ...props
}: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Chip
        label={label}
        color={color}
        variant={variant}
        size={size}
        onDelete={onDelete}
        onClick={onClick}
        className={className}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          ...sx,
        }}
        {...props}
      />
    </motion.div>
  );
}

// Enhanced Avatar Component
export function EnhancedAvatar({
  src,
  alt,
  children,
  size = 'medium',
  variant = 'circular',
  onClick,
  className,
  sx,
  ...props
}: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Avatar
        src={src}
        alt={alt}
        size={size}
        variant={variant}
        onClick={onClick}
        className={className}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Avatar>
    </motion.div>
  );
}

// Enhanced Badge Component
export function EnhancedBadge({
  badgeContent,
  color = 'primary',
  variant = 'standard',
  children,
  className,
  sx,
  ...props
}: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Badge
        badgeContent={badgeContent}
        color={color}
        variant={variant}
        className={className}
        sx={{
          transition: 'all 0.3s ease',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Badge>
    </motion.div>
  );
}

// Enhanced Progress Component
export function EnhancedLinearProgress({
  value = 0,
  color = 'primary',
  variant = 'determinate',
  size = 'medium',
  className,
  sx,
  ...props
}: any) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <LinearProgress
        value={displayValue}
        color={color}
        variant={variant}
        className={className}
        sx={{
          height: size === 'small' ? 4 : size === 'large' ? 8 : 6,
          borderRadius: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            transition: 'transform 0.6s ease',
          },
          ...sx,
        }}
        {...props}
      />
    </motion.div>
  );
}

// Enhanced Skeleton Component
export function EnhancedSkeleton({
  variant = 'rectangular',
  width,
  height,
  animation = 'wave',
  className,
  sx,
  ...props
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Skeleton
        variant={variant}
        width={width}
        height={height}
        animation={animation}
        className={className}
        sx={{
          borderRadius: 2,
          ...sx,
        }}
        {...props}
      />
    </motion.div>
  );
}

// Enhanced Alert Component
export function EnhancedAlert({
  severity = 'info',
  children,
  action,
  onClose,
  className,
  sx,
  ...props
}: any) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            severity={severity}
            action={action}
            onClose={onClose ? handleClose : undefined}
            className={className}
            sx={{
              borderRadius: 2,
              boxShadow: 1,
              ...sx,
            }}
            {...props}
          >
            {children}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Enhanced Snackbar Component
export function EnhancedSnackbar({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 6000,
  className,
  sx,
  ...props
}: any) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      className={className}
      sx={{
        '& .MuiSnackbarContent-root': {
          borderRadius: 2,
          boxShadow: 3,
        },
        ...sx,
      }}
      {...props}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

// Enhanced Dialog Component
export function EnhancedDialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = false,
  className,
  sx,
  ...props
}: any) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      className={className}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: 6,
        },
        ...sx,
      }}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {title && (
          <DialogTitle sx={{ pb: 1 }}>
            {title}
          </DialogTitle>
        )}
        <DialogContent sx={{ pt: 2 }}>
          {children}
        </DialogContent>
        {actions && (
          <DialogActions sx={{ pt: 2 }}>
            {actions}
          </DialogActions>
        )}
      </motion.div>
    </Dialog>
  );
}

// Enhanced Speed Dial Component
export function EnhancedSpeedDial({
  actions,
  icon,
  open,
  onOpen,
  onClose,
  className,
  sx,
  ...props
}: any) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SpeedDial
        ariaLabel="Speed dial"
        icon={icon}
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        className={className}
        sx={{
          '& .MuiFab-primary': {
            borderRadius: '50%',
            boxShadow: 3,
          },
          ...sx,
        }}
        {...props}
      >
        {actions.map((action: any) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
            sx={{
              '& .MuiFab-root': {
                borderRadius: '50%',
                boxShadow: 2,
              },
            }}
          />
        ))}
      </SpeedDial>
    </motion.div>
  );
}

// Enhanced Tabs Component
export function EnhancedTabs({
  value,
  onChange,
  children,
  className,
  sx,
  ...props
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        className={className}
        sx={{
          '& .MuiTab-root': {
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
          '& .MuiTabs-indicator': {
            transition: 'all 0.3s ease',
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Tabs>
    </motion.div>
  );
}

// Enhanced Accordion Component
export function EnhancedAccordion({
  children,
  expanded,
  onChange,
  className,
  sx,
  ...props
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Accordion
        expanded={expanded}
        onChange={onChange}
        className={className}
        sx={{
          borderRadius: 2,
          boxShadow: 1,
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Accordion>
    </motion.div>
  );
}

// Enhanced Stepper Component
export function EnhancedStepper({
  activeStep,
  children,
  className,
  sx,
  ...props
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Stepper
        activeStep={activeStep}
        className={className}
        sx={{
          '& .MuiStepLabel-root': {
            transition: 'all 0.3s ease',
          },
          '& .MuiStepIcon-root': {
            transition: 'all 0.3s ease',
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Stepper>
    </motion.div>
  );
}

// Enhanced Breadcrumbs Component
export function EnhancedBreadcrumbs({
  items,
  className,
  sx,
  ...props
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Breadcrumbs
        className={className}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            transition: 'all 0.3s ease',
          },
          ...sx,
        }}
        {...props}
      >
        {items.map((item: any, index: number) => (
          <Link
            key={index}
            href={item.href}
            color={index === items.length - 1 ? 'text.primary' : 'text.secondary'}
            sx={{
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {item.label}
          </Link>
        ))}
      </Breadcrumbs>
    </motion.div>
  );
}

// Enhanced List Component
export function EnhancedList({
  children,
  className,
  sx,
  ...props
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <List
        className={className}
        sx={{
          '& .MuiListItem-root': {
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </List>
    </motion.div>
  );
}

// Enhanced Drawer Component
export function EnhancedDrawer({
  open,
  onClose,
  children,
  variant = 'temporary',
  className,
  sx,
  ...props
}: any) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant={variant}
      className={className}
      sx={{
        '& .MuiDrawer-paper': {
          borderRadius: variant === 'temporary' ? '0 16px 16px 0' : 0,
          boxShadow: 3,
        },
        ...sx,
      }}
      {...props}
    >
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </Drawer>
  );
}

// Enhanced AppBar Component
export function EnhancedAppBar({
  children,
  position = 'static',
  className,
  sx,
  ...props
}: any) {
  return (
    <motion.div
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AppBar
        position={position}
        className={className}
        sx={{
          boxShadow: 2,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: 'text.primary',
          ...sx,
        }}
        {...props}
      >
        {children}
      </AppBar>
    </motion.div>
  );
}

// Enhanced Toolbar Component
export function EnhancedToolbar({
  children,
  className,
  sx,
  ...props
}: any) {
  return (
    <Toolbar
      className={className}
      sx={{
        minHeight: 64,
        transition: 'all 0.3s ease',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Toolbar>
  );
}

// Enhanced Theme Provider
export function EnhancedThemeProvider({ children }: any) {
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff5983',
        dark: '#9a0036',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

// Enhanced Responsive Hook
export function useEnhancedResponsive() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen: isMobile,
    isMediumScreen: isTablet && !isMobile,
    isLargeScreen: isDesktop,
  };
}

// Enhanced Animation Hook
export function useEnhancedAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return {
    isVisible,
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    slideIn: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 20, opacity: 0 },
      transition: { duration: 0.3 },
    },
    scaleIn: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 },
      transition: { duration: 0.3 },
    },
    bounceIn: {
      initial: { scale: 0.3, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.3, opacity: 0 },
      transition: { duration: 0.5, type: 'spring', bounce: 0.4 },
    },
  };
}

/**
 * White-Label Customization Service
 * Custom branding, theming, and multi-tenant solutions
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface WhiteLabelConfig {
  id: string;
  teamId: string;
  branding: BrandingConfig;
  theming: ThemingConfig;
  customization: CustomizationConfig;
  domain: DomainConfig;
  features: FeatureConfig;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandingConfig {
  logo?: string;
  logoDark?: string;
  favicon?: string;
  companyName: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  borderColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  fonts: FontConfig;
  customCss?: string;
  customJs?: string;
}

export interface FontConfig {
  primary: string;
  secondary: string;
  heading: string;
  body: string;
  mono: string;
  weights: number[];
  sizes: FontSizes;
}

export interface FontSizes {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export interface ThemingConfig {
  mode: 'light' | 'dark' | 'auto';
  palette: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  borderRadius: BorderRadiusConfig;
  shadows: ShadowConfig;
  animations: AnimationConfig;
}

export interface ColorPalette {
  primary: ColorShades;
  secondary: ColorShades;
  accent: ColorShades;
  neutral: ColorShades;
  success: ColorShades;
  warning: ColorShades;
  error: ColorShades;
  info: ColorShades;
}

export interface ColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface TypographyConfig {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: FontSizes;
  fontWeight: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export interface BorderRadiusConfig {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ShadowConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export interface AnimationConfig {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  transitions: {
    all: string;
    colors: string;
    opacity: string;
    shadow: string;
    transform: string;
  };
}

export interface CustomizationConfig {
  layout: LayoutConfig;
  components: ComponentConfig;
  pages: PageConfig;
  navigation: NavigationConfig;
  footer: FooterConfig;
  header: HeaderConfig;
}

export interface LayoutConfig {
  maxWidth: string;
  sidebar: {
    width: string;
    collapsed: boolean;
    position: 'left' | 'right';
  };
  header: {
    height: string;
    sticky: boolean;
    transparent: boolean;
  };
  footer: {
    height: string;
    sticky: boolean;
  };
  grid: {
    columns: number;
    gap: string;
  };
}

export interface ComponentConfig {
  buttons: ButtonConfig;
  cards: CardConfig;
  forms: FormConfig;
  tables: TableConfig;
  modals: ModalConfig;
  alerts: AlertConfig;
}

export interface ButtonConfig {
  variant: 'contained' | 'outlined' | 'text';
  size: 'small' | 'medium' | 'large';
  borderRadius: string;
  padding: string;
  fontWeight: number;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  shadow: string;
  hover: {
    transform: string;
    shadow: string;
  };
}

export interface CardConfig {
  elevation: number;
  borderRadius: string;
  padding: string;
  shadow: string;
  hover: {
    elevation: number;
    transform: string;
  };
}

export interface FormConfig {
  label: {
    fontSize: string;
    fontWeight: number;
    color: string;
    marginBottom: string;
  };
  input: {
    borderRadius: string;
    borderWidth: string;
    borderColor: string;
    padding: string;
    fontSize: string;
    focus: {
      borderColor: string;
      shadow: string;
    };
  };
  error: {
    color: string;
    fontSize: string;
    marginTop: string;
  };
}

export interface TableConfig {
  header: {
    backgroundColor: string;
    color: string;
    fontWeight: number;
    fontSize: string;
    padding: string;
  };
  row: {
    hover: {
      backgroundColor: string;
    };
    striped: boolean;
    borderColor: string;
  };
  cell: {
    padding: string;
    fontSize: string;
    borderColor: string;
  };
}

export interface ModalConfig {
  backdrop: {
    backgroundColor: string;
    opacity: number;
    blur: string;
  };
  content: {
    borderRadius: string;
    shadow: string;
    maxWidth: string;
    maxHeight: string;
  };
  animation: {
    duration: string;
    easing: string;
  };
}

export interface AlertConfig {
  borderRadius: string;
  padding: string;
  margin: string;
  fontSize: string;
  fontWeight: number;
  icon: {
    size: string;
    marginRight: string;
  };
}

export interface PageConfig {
  dashboard: DashboardPageConfig;
  analytics: AnalyticsPageConfig;
  scheduling: SchedulingPageConfig;
  publishing: PublishingPageConfig;
  settings: SettingsPageConfig;
}

export interface DashboardPageConfig {
  layout: 'grid' | 'list' | 'custom';
  widgets: string[];
  sidebar: boolean;
  header: boolean;
  footer: boolean;
}

export interface AnalyticsPageConfig {
  charts: {
    type: 'bar' | 'line' | 'pie' | 'area';
    colors: string[];
    animation: boolean;
  };
  filters: {
    position: 'top' | 'sidebar' | 'bottom';
    visible: boolean;
  };
  export: {
    formats: string[];
    enabled: boolean;
  };
}

export interface SchedulingPageConfig {
  calendar: {
    view: 'month' | 'week' | 'day' | 'agenda';
    theme: 'light' | 'dark' | 'auto';
  };
  sidebar: {
    width: string;
    position: 'left' | 'right';
  };
  dragDrop: {
    enabled: boolean;
    animation: boolean;
  };
}

export interface PublishingPageConfig {
  editor: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: string;
    fontFamily: string;
  };
  preview: {
    position: 'right' | 'bottom' | 'modal';
    size: 'small' | 'medium' | 'large';
  };
  platforms: {
    layout: 'grid' | 'list';
    showIcons: boolean;
  };
}

export interface SettingsPageConfig {
  layout: 'tabs' | 'sidebar' | 'accordion';
  sections: string[];
  search: boolean;
  help: boolean;
}

export interface NavigationConfig {
  type: 'sidebar' | 'top' | 'both';
  items: NavigationItem[];
  branding: {
    showLogo: boolean;
    showName: boolean;
    position: 'left' | 'center' | 'right';
  };
  user: {
    showAvatar: boolean;
    showName: boolean;
    dropdown: boolean;
  };
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: NavigationItem[];
  permissions?: string[];
  badge?: {
    text: string;
    color: string;
  };
}

export interface FooterConfig {
  show: boolean;
  content: FooterContent;
  links: FooterLink[];
  social: SocialLink[];
  copyright: string;
  backgroundColor: string;
  textColor: string;
}

export interface FooterContent {
  company: string;
  description: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

export interface HeaderConfig {
  show: boolean;
  height: string;
  backgroundColor: string;
  textColor: string;
  logo: {
    show: boolean;
    src?: string;
    alt: string;
    width: string;
    height: string;
  };
  navigation: {
    show: boolean;
    items: NavigationItem[];
  };
  user: {
    show: boolean;
    avatar: boolean;
    name: boolean;
    dropdown: boolean;
  };
  search: {
    show: boolean;
    placeholder: string;
  };
  notifications: {
    show: boolean;
    count: boolean;
  };
}

export interface DomainConfig {
  customDomain?: string;
  subdomain?: string;
  ssl: boolean;
  redirects: DomainRedirect[];
  dns: DNSConfig;
}

export interface DomainRedirect {
  from: string;
  to: string;
  type: 'permanent' | 'temporary';
}

export interface DNSConfig {
  cname?: string;
  a?: string;
  txt?: string;
}

export interface FeatureConfig {
  enabled: string[];
  disabled: string[];
  limits: FeatureLimits;
  customizations: FeatureCustomizations;
}

export interface FeatureLimits {
  maxUsers: number;
  maxStorage: number;
  maxBandwidth: number;
  maxAPIRequests: number;
  maxCustomDomains: number;
}

export interface FeatureCustomizations {
  allowCustomCSS: boolean;
  allowCustomJS: boolean;
  allowCustomFonts: boolean;
  allowCustomColors: boolean;
  allowCustomLogo: boolean;
  allowCustomFavicon: boolean;
}

export class WhiteLabelService {
  /**
   * Create white-label configuration
   */
  async createWhiteLabelConfig(
    teamId: string,
    config: Partial<WhiteLabelConfig>
  ): Promise<WhiteLabelConfig> {
    try {
      const defaultConfig = this.getDefaultConfig();
      
      const whiteLabelConfig = await prisma.whiteLabelConfig.create({
        data: {
          teamId,
          branding: { ...defaultConfig.branding, ...config.branding },
          theming: { ...defaultConfig.theming, ...config.theming },
          customization: { ...defaultConfig.customization, ...config.customization },
          domain: { ...defaultConfig.domain, ...config.domain },
          features: { ...defaultConfig.features, ...config.features },
          isActive: true,
        },
      });

      return this.mapWhiteLabelConfig(whiteLabelConfig);
    } catch (error) {
      console.error('Create white-label config error:', error);
      throw error;
    }
  }

  /**
   * Get white-label configuration
   */
  async getWhiteLabelConfig(teamId: string): Promise<WhiteLabelConfig | null> {
    try {
      const config = await prisma.whiteLabelConfig.findFirst({
        where: { teamId, isActive: true },
      });

      return config ? this.mapWhiteLabelConfig(config) : null;
    } catch (error) {
      console.error('Get white-label config error:', error);
      throw error;
    }
  }

  /**
   * Update white-label configuration
   */
  async updateWhiteLabelConfig(
    teamId: string,
    updates: Partial<WhiteLabelConfig>
  ): Promise<WhiteLabelConfig> {
    try {
      const config = await prisma.whiteLabelConfig.update({
        where: { teamId },
        data: {
          branding: updates.branding,
          theming: updates.theming,
          customization: updates.customization,
          domain: updates.domain,
          features: updates.features,
          updatedAt: new Date(),
        },
      });

      return this.mapWhiteLabelConfig(config);
    } catch (error) {
      console.error('Update white-label config error:', error);
      throw error;
    }
  }

  /**
   * Generate CSS from configuration
   */
  generateCSS(config: WhiteLabelConfig): string {
    const { branding, theming, customization } = config;
    
    let css = `
      :root {
        /* Brand Colors */
        --primary-color: ${branding.primaryColor};
        --secondary-color: ${branding.secondaryColor};
        --accent-color: ${branding.accentColor};
        --background-color: ${branding.backgroundColor};
        --text-color: ${branding.textColor};
        --link-color: ${branding.linkColor};
        --border-color: ${branding.borderColor};
        --success-color: ${branding.successColor};
        --warning-color: ${branding.warningColor};
        --error-color: ${branding.errorColor};
        --info-color: ${branding.infoColor};
        
        /* Typography */
        --font-primary: ${branding.fonts.primary};
        --font-secondary: ${branding.fonts.secondary};
        --font-heading: ${branding.fonts.heading};
        --font-body: ${branding.fonts.body};
        --font-mono: ${branding.fonts.mono};
        
        /* Spacing */
        --spacing-xs: ${theming.spacing.xs};
        --spacing-sm: ${theming.spacing.sm};
        --spacing-md: ${theming.spacing.md};
        --spacing-lg: ${theming.spacing.lg};
        --spacing-xl: ${theming.spacing.xl};
        
        /* Border Radius */
        --border-radius-sm: ${theming.borderRadius.sm};
        --border-radius-md: ${theming.borderRadius.md};
        --border-radius-lg: ${theming.borderRadius.lg};
        --border-radius-xl: ${theming.borderRadius.xl};
        
        /* Shadows */
        --shadow-sm: ${theming.shadows.sm};
        --shadow-md: ${theming.shadows.md};
        --shadow-lg: ${theming.shadows.lg};
        --shadow-xl: ${theming.shadows.xl};
        
        /* Animations */
        --animation-duration-fast: ${theming.animations.duration.fast};
        --animation-duration-normal: ${theming.animations.duration.normal};
        --animation-duration-slow: ${theming.animations.duration.slow};
        --animation-easing: ${theming.animations.easing.ease};
      }
      
      /* Global Styles */
      body {
        font-family: var(--font-body);
        color: var(--text-color);
        background-color: var(--background-color);
        line-height: 1.6;
      }
      
      /* Typography */
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading);
        font-weight: 600;
        line-height: 1.2;
        margin-bottom: var(--spacing-md);
      }
      
      /* Buttons */
      .btn {
        font-family: var(--font-primary);
        font-weight: ${customization.components.buttons.fontWeight};
        text-transform: ${customization.components.buttons.textTransform};
        border-radius: ${customization.components.buttons.borderRadius};
        padding: ${customization.components.buttons.padding};
        box-shadow: ${customization.components.buttons.shadow};
        transition: all var(--animation-duration-normal) var(--animation-easing);
      }
      
      .btn:hover {
        transform: ${customization.components.buttons.hover.transform};
        box-shadow: ${customization.components.buttons.hover.shadow};
      }
      
      /* Cards */
      .card {
        border-radius: ${customization.components.cards.borderRadius};
        padding: ${customization.components.cards.padding};
        box-shadow: ${customization.components.cards.shadow};
        transition: all var(--animation-duration-normal) var(--animation-easing);
      }
      
      .card:hover {
        box-shadow: ${customization.components.cards.hover.shadow};
        transform: ${customization.components.cards.hover.transform};
      }
      
      /* Forms */
      .form-label {
        font-size: ${customization.components.forms.label.fontSize};
        font-weight: ${customization.components.forms.label.fontWeight};
        color: ${customization.components.forms.label.color};
        margin-bottom: ${customization.components.forms.label.marginBottom};
      }
      
      .form-input {
        border-radius: ${customization.components.forms.input.borderRadius};
        border-width: ${customization.components.forms.input.borderWidth};
        border-color: ${customization.components.forms.input.borderColor};
        padding: ${customization.components.forms.input.padding};
        font-size: ${customization.components.forms.input.fontSize};
        transition: all var(--animation-duration-normal) var(--animation-easing);
      }
      
      .form-input:focus {
        border-color: ${customization.components.forms.input.focus.borderColor};
        box-shadow: ${customization.components.forms.input.focus.shadow};
        outline: none;
      }
      
      .form-error {
        color: ${customization.components.forms.error.color};
        font-size: ${customization.components.forms.error.fontSize};
        margin-top: ${customization.components.forms.error.marginTop};
      }
      
      /* Tables */
      .table-header {
        background-color: ${customization.components.tables.header.backgroundColor};
        color: ${customization.components.tables.header.color};
        font-weight: ${customization.components.tables.header.fontWeight};
        font-size: ${customization.components.tables.header.fontSize};
        padding: ${customization.components.tables.header.padding};
      }
      
      .table-row:hover {
        background-color: ${customization.components.tables.row.hover.backgroundColor};
      }
      
      .table-cell {
        padding: ${customization.components.tables.cell.padding};
        font-size: ${customization.components.tables.cell.fontSize};
        border-color: ${customization.components.tables.cell.borderColor};
      }
      
      /* Modals */
      .modal-backdrop {
        background-color: ${customization.components.modals.backdrop.backgroundColor};
        opacity: ${customization.components.modals.backdrop.opacity};
        backdrop-filter: blur(${customization.components.modals.backdrop.blur});
      }
      
      .modal-content {
        border-radius: ${customization.components.modals.content.borderRadius};
        box-shadow: ${customization.components.modals.content.shadow};
        max-width: ${customization.components.modals.content.maxWidth};
        max-height: ${customization.components.modals.content.maxHeight};
      }
      
      /* Alerts */
      .alert {
        border-radius: ${customization.components.alerts.borderRadius};
        padding: ${customization.components.alerts.padding};
        margin: ${customization.components.alerts.margin};
        font-size: ${customization.components.alerts.fontSize};
        font-weight: ${customization.components.alerts.fontWeight};
      }
      
      .alert-icon {
        width: ${customization.components.alerts.icon.size};
        height: ${customization.components.alerts.icon.size};
        margin-right: ${customization.components.alerts.icon.marginRight};
      }
      
      /* Custom CSS */
      ${branding.customCss || ''}
    `;

    return css;
  }

  /**
   * Generate theme configuration for Material-UI
   */
  generateMUITheme(config: WhiteLabelConfig): any {
    const { branding, theming } = config;
    
    return {
      palette: {
        mode: theming.mode,
        primary: {
          main: branding.primaryColor,
          light: this.lightenColor(branding.primaryColor, 0.2),
          dark: this.darkenColor(branding.primaryColor, 0.2),
        },
        secondary: {
          main: branding.secondaryColor,
          light: this.lightenColor(branding.secondaryColor, 0.2),
          dark: this.darkenColor(branding.secondaryColor, 0.2),
        },
        background: {
          default: branding.backgroundColor,
          paper: this.lightenColor(branding.backgroundColor, 0.05),
        },
        text: {
          primary: branding.textColor,
          secondary: this.lightenColor(branding.textColor, 0.3),
        },
        success: {
          main: branding.successColor,
        },
        warning: {
          main: branding.warningColor,
        },
        error: {
          main: branding.errorColor,
        },
        info: {
          main: branding.infoColor,
        },
      },
      typography: {
        fontFamily: branding.fonts.primary,
        h1: {
          fontFamily: branding.fonts.heading,
          fontWeight: 600,
        },
        h2: {
          fontFamily: branding.fonts.heading,
          fontWeight: 600,
        },
        h3: {
          fontFamily: branding.fonts.heading,
          fontWeight: 600,
        },
        h4: {
          fontFamily: branding.fonts.heading,
          fontWeight: 600,
        },
        h5: {
          fontFamily: branding.fonts.heading,
          fontWeight: 600,
        },
        h6: {
          fontFamily: branding.fonts.heading,
          fontWeight: 600,
        },
        body1: {
          fontFamily: branding.fonts.body,
        },
        body2: {
          fontFamily: branding.fonts.body,
        },
      },
      shape: {
        borderRadius: 8,
      },
      spacing: 8,
    };
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): WhiteLabelConfig {
    return {
      id: '',
      teamId: '',
      branding: {
        companyName: 'CreatorFlow',
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
        accentColor: '#9c27b0',
        backgroundColor: '#ffffff',
        textColor: '#212121',
        linkColor: '#1976d2',
        borderColor: '#e0e0e0',
        successColor: '#2e7d32',
        warningColor: '#f57c00',
        errorColor: '#d32f2f',
        infoColor: '#0288d1',
        fonts: {
          primary: 'Inter, sans-serif',
          secondary: 'Inter, sans-serif',
          heading: 'Inter, sans-serif',
          body: 'Inter, sans-serif',
          mono: 'JetBrains Mono, monospace',
          weights: [300, 400, 500, 600, 700],
          sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '3.75rem',
          },
        },
      },
      theming: {
        mode: 'light',
        palette: {
          primary: {
            50: '#e3f2fd',
            100: '#bbdefb',
            200: '#90caf9',
            300: '#64b5f6',
            400: '#42a5f5',
            500: '#2196f3',
            600: '#1e88e5',
            700: '#1976d2',
            800: '#1565c0',
            900: '#0d47a1',
          },
          secondary: {
            50: '#fce4ec',
            100: '#f8bbd9',
            200: '#f48fb1',
            300: '#f06292',
            400: '#ec407a',
            500: '#e91e63',
            600: '#d81b60',
            700: '#c2185b',
            800: '#ad1457',
            900: '#880e4f',
          },
          accent: {
            50: '#f3e5f5',
            100: '#e1bee7',
            200: '#ce93d8',
            300: '#ba68c8',
            400: '#ab47bc',
            500: '#9c27b0',
            600: '#8e24aa',
            700: '#7b1fa2',
            800: '#6a1b9a',
            900: '#4a148c',
          },
          neutral: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
          },
          success: {
            50: '#e8f5e8',
            100: '#c8e6c9',
            200: '#a5d6a7',
            300: '#81c784',
            400: '#66bb6a',
            500: '#4caf50',
            600: '#43a047',
            700: '#388e3c',
            800: '#2e7d32',
            900: '#1b5e20',
          },
          warning: {
            50: '#fff8e1',
            100: '#ffecb3',
            200: '#ffe082',
            300: '#ffd54f',
            400: '#ffca28',
            500: '#ffc107',
            600: '#ffb300',
            700: '#ffa000',
            800: '#ff8f00',
            900: '#ff6f00',
          },
          error: {
            50: '#ffebee',
            100: '#ffcdd2',
            200: '#ef9a9a',
            300: '#e57373',
            400: '#ef5350',
            500: '#f44336',
            600: '#e53935',
            700: '#d32f2f',
            800: '#c62828',
            900: '#b71c1c',
          },
          info: {
            50: '#e1f5fe',
            100: '#b3e5fc',
            200: '#81d4fa',
            300: '#4fc3f7',
            400: '#29b6f6',
            500: '#03a9f4',
            600: '#039be5',
            700: '#0288d1',
            800: '#0277bd',
            900: '#01579b',
          },
        },
        typography: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Georgia', 'serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '3.75rem',
          },
          fontWeight: {
            thin: 100,
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900,
          },
          lineHeight: {
            none: 1,
            tight: 1.25,
            snug: 1.375,
            normal: 1.5,
            relaxed: 1.625,
            loose: 2,
          },
          letterSpacing: {
            tighter: '-0.05em',
            tight: '-0.025em',
            normal: '0em',
            wide: '0.025em',
            wider: '0.05em',
            widest: '0.1em',
          },
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem',
          '3xl': '4rem',
          '4xl': '5rem',
          '5xl': '6rem',
          '6xl': '8rem',
        },
        borderRadius: {
          none: '0',
          sm: '0.125rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          full: '9999px',
        },
        shadows: {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          none: 'none',
        },
        animations: {
          duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
          },
          easing: {
            linear: 'linear',
            ease: 'ease',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out',
          },
          transitions: {
            all: 'all 300ms ease',
            colors: 'color 300ms ease, background-color 300ms ease, border-color 300ms ease',
            opacity: 'opacity 300ms ease',
            shadow: 'box-shadow 300ms ease',
            transform: 'transform 300ms ease',
          },
        },
      },
      customization: {
        layout: {
          maxWidth: '1200px',
          sidebar: {
            width: '280px',
            collapsed: false,
            position: 'left',
          },
          header: {
            height: '64px',
            sticky: true,
            transparent: false,
          },
          footer: {
            height: '80px',
            sticky: false,
          },
          grid: {
            columns: 12,
            gap: '1rem',
          },
        },
        components: {
          buttons: {
            variant: 'contained',
            size: 'medium',
            borderRadius: '0.375rem',
            padding: '0.5rem 1rem',
            fontWeight: 500,
            textTransform: 'none',
            shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            hover: {
              transform: 'translateY(-1px)',
              shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
          },
          cards: {
            elevation: 1,
            borderRadius: '0.5rem',
            padding: '1.5rem',
            shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            hover: {
              elevation: 2,
              transform: 'translateY(-2px)',
            },
          },
          forms: {
            label: {
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '0.5rem',
            },
            input: {
              borderRadius: '0.375rem',
              borderWidth: '1px',
              borderColor: '#d1d5db',
              padding: '0.5rem 0.75rem',
              fontSize: '1rem',
              focus: {
                borderColor: '#3b82f6',
                shadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              },
            },
            error: {
              color: '#dc2626',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
            },
          },
          tables: {
            header: {
              backgroundColor: '#f9fafb',
              color: '#374151',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.75rem',
            },
            row: {
              hover: {
                backgroundColor: '#f9fafb',
              },
              striped: true,
              borderColor: '#e5e7eb',
            },
            cell: {
              padding: '0.75rem',
              fontSize: '0.875rem',
              borderColor: '#e5e7eb',
            },
          },
          modals: {
            backdrop: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              opacity: 1,
              blur: '4px',
            },
            content: {
              borderRadius: '0.5rem',
              shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              maxHeight: '80vh',
            },
            animation: {
              duration: '300ms',
              easing: 'ease-out',
            },
          },
          alerts: {
            borderRadius: '0.375rem',
            padding: '0.75rem 1rem',
            margin: '0.5rem 0',
            fontSize: '0.875rem',
            fontWeight: 500,
            icon: {
              size: '1.25rem',
              marginRight: '0.5rem',
            },
          },
        },
        pages: {
          dashboard: {
            layout: 'grid',
            widgets: ['overview', 'recent_posts', 'analytics', 'scheduling'],
            sidebar: true,
            header: true,
            footer: true,
          },
          analytics: {
            charts: {
              type: 'bar',
              colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'],
              animation: true,
            },
            filters: {
              position: 'top',
              visible: true,
            },
            export: {
              formats: ['pdf', 'excel', 'csv'],
              enabled: true,
            },
          },
          scheduling: {
            calendar: {
              view: 'month',
              theme: 'light',
            },
            sidebar: {
              width: '300px',
              position: 'right',
            },
            dragDrop: {
              enabled: true,
              animation: true,
            },
          },
          publishing: {
            editor: {
              theme: 'light',
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif',
            },
            preview: {
              position: 'right',
              size: 'medium',
            },
            platforms: {
              layout: 'grid',
              showIcons: true,
            },
          },
          settings: {
            layout: 'tabs',
            sections: ['general', 'team', 'billing', 'integrations'],
            search: true,
            help: true,
          },
        },
        navigation: {
          type: 'sidebar',
          items: [],
          branding: {
            showLogo: true,
            showName: true,
            position: 'left',
          },
          user: {
            showAvatar: true,
            showName: true,
            dropdown: true,
          },
        },
        footer: {
          show: true,
          content: {
            company: 'CreatorFlow',
            description: 'The ultimate content management platform for creators.',
          },
          links: [],
          social: [],
          copyright: '© 2024 CreatorFlow. All rights reserved.',
          backgroundColor: '#f9fafb',
          textColor: '#6b7280',
        },
        header: {
          show: true,
          height: '64px',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          logo: {
            show: true,
            alt: 'CreatorFlow',
            width: '32px',
            height: '32px',
          },
          navigation: {
            show: true,
            items: [],
          },
          user: {
            show: true,
            avatar: true,
            name: true,
            dropdown: true,
          },
          search: {
            show: true,
            placeholder: 'Search...',
          },
          notifications: {
            show: true,
            count: true,
          },
        },
      },
      domain: {
        ssl: true,
        redirects: [],
        dns: {},
      },
      features: {
        enabled: ['analytics', 'scheduling', 'publishing'],
        disabled: [],
        limits: {
          maxUsers: 10,
          maxStorage: 1,
          maxBandwidth: 10,
          maxAPIRequests: 1000,
          maxCustomDomains: 1,
        },
        customizations: {
          allowCustomCSS: false,
          allowCustomJS: false,
          allowCustomFonts: false,
          allowCustomColors: false,
          allowCustomLogo: false,
          allowCustomFavicon: false,
        },
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Lighten color
   */
  private lightenColor(color: string, amount: number): string {
    // Simple color lightening implementation
    // In production, use a proper color manipulation library
    return color;
  }

  /**
   * Darken color
   */
  private darkenColor(color: string, amount: number): string {
    // Simple color darkening implementation
    // In production, use a proper color manipulation library
    return color;
  }

  /**
   * Map database white-label config to interface
   */
  private mapWhiteLabelConfig(config: any): WhiteLabelConfig {
    return {
      id: config.id,
      teamId: config.teamId,
      branding: config.branding as BrandingConfig,
      theming: config.theming as ThemingConfig,
      customization: config.customization as CustomizationConfig,
      domain: config.domain as DomainConfig,
      features: config.features as FeatureConfig,
      isActive: config.isActive,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }
}

// Export singleton instance
export const whiteLabelService = new WhiteLabelService();

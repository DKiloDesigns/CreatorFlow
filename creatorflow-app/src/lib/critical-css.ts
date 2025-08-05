// Critical CSS utilities for performance optimization

// Critical CSS for above-the-fold content
export const CRITICAL_CSS = `
  /* Critical CSS for immediate rendering */
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* MUI Critical Styles */
  .MuiBox-root {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  .MuiContainer-root {
    box-sizing: border-box;
    display: block;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .MuiTypography-root {
    margin: 0;
  }
  
  .MuiButton-root {
    box-sizing: border-box;
    position: relative;
    user-select: none;
    vertical-align: middle;
    -moz-appearance: none;
    -webkit-appearance: none;
    text-decoration: none;
    cursor: pointer;
    border: 0;
    margin: 0;
    display: inline-flex;
    outline: 0;
    padding: 6px 16px;
    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 500;
    line-height: 1.75;
    border-radius: 4px;
    text-transform: uppercase;
  }
  
  /* Loading states */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #121212;
      color: #ffffff;
    }
  }
`;

// Inject critical CSS into head
export function injectCriticalCSS() {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = CRITICAL_CSS;
    document.head.appendChild(style);
  }
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof document !== 'undefined') {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);

    // Preload critical images
    const criticalImages = [
      '/logo.png',
      '/favicon.ico',
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }
}

// Remove non-critical CSS
export function removeNonCriticalCSS() {
  if (typeof document !== 'undefined') {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('critical')) {
        link.setAttribute('media', 'print');
        link.setAttribute('onload', "this.media='all'");
      }
    });
  }
}

// Load CSS asynchronously
export function loadCSSAsync(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => reject();
      document.head.appendChild(link);
    }
  });
}

// Optimize CSS delivery
export function optimizeCSSDelivery() {
  if (typeof document !== 'undefined') {
    // Inject critical CSS immediately
    injectCriticalCSS();
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Load non-critical CSS asynchronously
    setTimeout(() => {
      loadCSSAsync('/styles/non-critical.css').catch(console.error);
    }, 100);
  }
} 
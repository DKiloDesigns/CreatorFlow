/**
 * Accessibility Improvements
 * Tools and utilities for enhancing accessibility and usability
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// Keyboard navigation hook
export function useKeyboardNavigation() {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      setIsNavigating(true);
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsNavigating(false);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);

  return { focusedIndex, setFocusedIndex, isNavigating };
}

// Focus management hook
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [focusHistory, setFocusHistory] = useState<HTMLElement[]>([]);

  const focusElement = useCallback((element: HTMLElement) => {
    if (focusedElement) {
      setFocusHistory(prev => [...prev, focusedElement]);
    }
    element.focus();
    setFocusedElement(element);
  }, [focusedElement]);

  const focusPrevious = useCallback(() => {
    if (focusHistory.length > 0) {
      const previousElement = focusHistory[focusHistory.length - 1];
      setFocusHistory(prev => prev.slice(0, -1));
      focusElement(previousElement);
    }
  }, [focusHistory, focusElement]);

  const focusNext = useCallback((elements: HTMLElement[]) => {
    const currentIndex = elements.indexOf(focusedElement!);
    const nextIndex = (currentIndex + 1) % elements.length;
    focusElement(elements[nextIndex]);
  }, [focusedElement, focusElement]);

  const focusPrevious = useCallback((elements: HTMLElement[]) => {
    const currentIndex = elements.indexOf(focusedElement!);
    const prevIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
    focusElement(elements[prevIndex]);
  }, [focusedElement, focusElement]);

  return {
    focusedElement,
    focusElement,
    focusPrevious,
    focusNext,
    focusPrevious,
  };
}

// Screen reader support hook
export function useScreenReaderSupport() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    // Check if screen reader is active
    const checkScreenReader = () => {
      const hasScreenReader = window.speechSynthesis || window.speechSynthesis;
      setIsScreenReaderActive(!!hasScreenReader);
    };

    checkScreenReader();
  }, []);

  const announce = useCallback((message: string) => {
    setAnnouncements(prev => [...prev, message]);
    
    // Clear announcement after 5 seconds
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 5000);
  }, []);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return {
    announcements,
    isScreenReaderActive,
    announce,
    speak,
  };
}

// High contrast mode hook
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      // Check for high contrast mode
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      setIsHighContrast(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setIsHighContrast(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    };

    checkHighContrast();
  }, []);

  return { isHighContrast };
}

// Reduced motion hook
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    };

    checkReducedMotion();
  }, []);

  return { prefersReducedMotion };
}

// Color scheme hook
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'auto'>('auto');

  useEffect(() => {
    const checkColorScheme = () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setColorScheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e: MediaQueryListEvent) => {
        setColorScheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    };

    checkColorScheme();
  }, []);

  return { colorScheme };
}

// Font size hook
export function useFontSize() {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>('medium');

  useEffect(() => {
    const checkFontSize = () => {
      const mediaQuery = window.matchMedia('(prefers-font-size: large)');
      setFontSize(mediaQuery.matches ? 'large' : 'medium');

      const handleChange = (e: MediaQueryListEvent) => {
        setFontSize(e.matches ? 'large' : 'medium');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    };

    checkFontSize();
  }, []);

  return { fontSize };
}

// ARIA live region hook
export function useAriaLiveRegion() {
  const [liveRegion, setLiveRegion] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create or get existing live region
    let region = document.getElementById('aria-live-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'aria-live-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.style.position = 'absolute';
      region.style.left = '-10000px';
      region.style.width = '1px';
      region.style.height = '1px';
      region.style.overflow = 'hidden';
      document.body.appendChild(region);
    }
    setLiveRegion(region);

    return () => {
      if (region && region.parentNode) {
        region.parentNode.removeChild(region);
      }
    };
  }, []);

  const announce = useCallback((message: string) => {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, [liveRegion]);

  return { announce };
}

// Skip links hook
export function useSkipLinks() {
  const [skipLinks, setSkipLinks] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const links = document.querySelectorAll('[data-skip-link]') as NodeListOf<HTMLElement>;
    setSkipLinks(Array.from(links));
  }, []);

  const focusSkipLink = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return { skipLinks, focusSkipLink };
}

// Landmark navigation hook
export function useLandmarkNavigation() {
  const [landmarks, setLandmarks] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const landmarkSelectors = [
      'main',
      'nav',
      'header',
      'footer',
      'aside',
      'section[aria-labelledby]',
      'section[aria-label]',
      '[role="banner"]',
      '[role="navigation"]',
      '[role="main"]',
      '[role="complementary"]',
      '[role="contentinfo"]',
    ];

    const landmarkElements = landmarkSelectors.flatMap(selector =>
      Array.from(document.querySelectorAll(selector)) as HTMLElement[]
    );

    setLandmarks(landmarkElements);
  }, []);

  const focusLandmark = useCallback((index: number) => {
    if (landmarks[index]) {
      landmarks[index].focus();
      landmarks[index].scrollIntoView({ behavior: 'smooth' });
    }
  }, [landmarks]);

  return { landmarks, focusLandmark };
}

// Form validation hook
export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: any, rules: any) => {
    const fieldErrors: string[] = [];

    if (rules.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push(`${name} is required`);
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      fieldErrors.push(`${name} must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      fieldErrors.push(`${name} must be no more than ${rules.maxLength} characters`);
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      fieldErrors.push(`${name} format is invalid`);
    }

    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      fieldErrors.push(`${name} must be a valid email address`);
    }

    if (rules.url && value && !/^https?:\/\/.+/.test(value)) {
      fieldErrors.push(`${name} must be a valid URL`);
    }

    return fieldErrors[0] || null;
  }, []);

  const validateForm = useCallback((formData: any, validationRules: any) => {
    const newErrors: Record<string, string> = {};

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field], validationRules[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  const handleFieldChange = useCallback((name: string, value: any, rules: any) => {
    const error = validateField(name, value, rules);
    setErrors(prev => ({
      ...prev,
      [name]: error || '',
    }));
  }, [validateField]);

  const handleFieldBlur = useCallback((name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  return {
    errors,
    touched,
    validateForm,
    handleFieldChange,
    handleFieldBlur,
  };
}

// Error handling hook
export function useErrorHandling() {
  const [errors, setErrors] = useState<Error[]>([]);

  const addError = useCallback((error: Error) => {
    setErrors(prev => [...prev, error]);
  }, []);

  const removeError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
  };
}

// Loading states hook
export function useLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  return {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
  };
}

// Accessibility testing hook
export function useAccessibilityTesting() {
  const [testResults, setTestResults] = useState<any[]>([]);

  const runAccessibilityTests = useCallback(() => {
    const results: any[] = [];

    // Check for missing alt text
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt) {
        results.push({
          type: 'error',
          element: 'img',
          message: 'Image missing alt text',
          index,
        });
      }
    });

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        results.push({
          type: 'error',
          element: 'input',
          message: 'Form control missing label',
          index,
        });
      }
    });

    // Check for missing heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > lastLevel + 1) {
        results.push({
          type: 'warning',
          element: 'heading',
          message: 'Heading level skipped',
          index,
        });
      }
      lastLevel = level;
    });

    // Check for missing focus indicators
    const focusableElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex]');
    focusableElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const outline = computedStyle.outline;
      const boxShadow = computedStyle.boxShadow;
      if (outline === 'none' && !boxShadow.includes('rgb')) {
        results.push({
          type: 'warning',
          element: 'focusable',
          message: 'Element may lack visible focus indicator',
          index,
        });
      }
    });

    setTestResults(results);
    return results;
  }, []);

  return {
    testResults,
    runAccessibilityTests,
  };
}

// Export all hooks
export {
  useKeyboardNavigation,
  useFocusManagement,
  useScreenReaderSupport,
  useHighContrastMode,
  useReducedMotion,
  useColorScheme,
  useFontSize,
  useAriaLiveRegion,
  useSkipLinks,
  useLandmarkNavigation,
  useFormValidation,
  useErrorHandling,
  useLoadingStates,
  useAccessibilityTesting,
};

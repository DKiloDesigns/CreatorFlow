'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Fade, 
  Slide, 
  Zoom, 
  Grow, 
  Collapse,
  useTheme
} from '@mui/material';

// Optimized animation wrapper
interface AnimationWrapperProps {
  children: React.ReactNode;
  in: boolean;
  type?: 'fade' | 'slide' | 'zoom' | 'grow' | 'collapse';
  direction?: 'up' | 'down' | 'left' | 'right';
  timeout?: number;
  delay?: number;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

export function AnimationWrapper({
  children,
  in: show,
  type = 'fade',
  direction = 'up',
  timeout = 300,
  delay = 0,
  mountOnEnter = true,
  unmountOnExit = true
}: AnimationWrapperProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [show, timeout]);

  const animationProps = {
    in: show,
    timeout: timeout,
    mountOnEnter,
    unmountOnExit,
  };

  const renderAnimation = () => {
    switch (type) {
      case 'slide':
        return (
          <Slide direction={direction} {...animationProps}>
            <Box>{children}</Box>
          </Slide>
        );
      case 'zoom':
        return (
          <Zoom {...animationProps}>
            <Box>{children}</Box>
          </Zoom>
        );
      case 'grow':
        return (
          <Grow {...animationProps}>
            <Box>{children}</Box>
          </Grow>
        );
      case 'collapse':
        return (
          <Collapse {...animationProps}>
            <Box>{children}</Box>
          </Collapse>
        );
      default:
        return (
          <Fade {...animationProps}>
            <Box>{children}</Box>
          </Fade>
        );
    }
  };

  if (!shouldRender) return null;

  return (
    <Box sx={{ animationDelay: `${delay}ms` }}>
      {renderAnimation()}
    </Box>
  );
}

// Staggered animation container
interface StaggeredContainerProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  animationType?: 'fade' | 'slide' | 'zoom';
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function StaggeredContainer({
  children,
  staggerDelay = 100,
  animationType = 'fade',
  direction = 'up'
}: StaggeredContainerProps) {
  return (
    <Box>
      {children.map((child, index) => (
        <AnimationWrapper
          key={index}
          in={true}
          type={animationType}
          direction={direction}
          delay={index * staggerDelay}
        >
          {child}
        </AnimationWrapper>
      ))}
    </Box>
  );
}

// Intersection observer animation
interface IntersectionAnimationProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  animationType?: 'fade' | 'slide' | 'zoom';
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
}

export function IntersectionAnimation({
  children,
  threshold = 0.1,
  rootMargin = '0px',
  animationType = 'fade',
  direction = 'up',
  once = true
}: IntersectionAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (once) setHasAnimated(true);
      } else if (!once) {
        setIsVisible(false);
      }
    });
  }, [once]);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    const element = document.querySelector('[data-intersection-target]');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [observerCallback, threshold, rootMargin]);

  return (
    <Box data-intersection-target>
      <AnimationWrapper
        in={isVisible && (!once || !hasAnimated)}
        type={animationType}
        direction={direction}
      >
        {children}
      </AnimationWrapper>
    </Box>
  );
}

// Performance optimized scroll animations
interface ScrollAnimationProps {
  children: React.ReactNode;
  trigger?: 'scroll' | 'hover' | 'click';
  animationType?: 'fade' | 'slide' | 'zoom';
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
}

export function ScrollAnimation({
  children,
  trigger = 'scroll',
  animationType = 'fade',
  direction = 'up',
  threshold = 0.1
}: ScrollAnimationProps) {
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    if (trigger === 'scroll') {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const element = document.querySelector('[data-scroll-target]');
        
        if (element) {
          const elementTop = element.getBoundingClientRect().top;
          const elementHeight = element.offsetHeight;
          
          if (scrollTop + windowHeight > elementTop + elementHeight * threshold) {
            setIsTriggered(true);
          }
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Check initial state

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [trigger, threshold]);

  const handleHover = useCallback(() => {
    if (trigger === 'hover') {
      setIsTriggered(true);
    }
  }, [trigger]);

  const handleClick = useCallback(() => {
    if (trigger === 'click') {
      setIsTriggered(true);
    }
  }, [trigger]);

  return (
    <Box
      data-scroll-target
      onMouseEnter={handleHover}
      onClick={handleClick}
    >
      <AnimationWrapper
        in={isTriggered}
        type={animationType}
        direction={direction}
      >
        {children}
      </AnimationWrapper>
    </Box>
  );
}

// Optimized transition group
interface TransitionGroupProps {
  children: React.ReactNode[];
  animationType?: 'fade' | 'slide' | 'zoom';
  direction?: 'up' | 'down' | 'left' | 'right';
  staggerDelay?: number;
}

export function TransitionGroup({
  children,
  animationType = 'fade',
  direction = 'up',
  staggerDelay = 50
}: TransitionGroupProps) {
  return (
    <Box>
      {children.map((child, index) => (
        <AnimationWrapper
          key={index}
          in={true}
          type={animationType}
          direction={direction}
          delay={index * staggerDelay}
          timeout={300 + index * staggerDelay}
        >
          {child}
        </AnimationWrapper>
      ))}
    </Box>
  );
}

// Performance monitoring for animations
interface AnimationPerformanceProps {
  children: React.ReactNode;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  trackPerformance?: boolean;
}

export function AnimationPerformance({
  children,
  onAnimationStart,
  onAnimationEnd,
  trackPerformance = false
}: AnimationPerformanceProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const handleAnimationStart = useCallback(() => {
    if (trackPerformance) {
      setStartTime(performance.now());
    }
    setIsAnimating(true);
    onAnimationStart?.();
  }, [trackPerformance, onAnimationStart]);

  const handleAnimationEnd = useCallback(() => {
    if (trackPerformance && startTime > 0) {
      const duration = performance.now() - startTime;
      console.log(`Animation completed in ${duration.toFixed(2)}ms`);
    }
    setIsAnimating(false);
    onAnimationEnd?.();
  }, [trackPerformance, startTime, onAnimationEnd]);

  return (
    <Box
      onAnimationStart={handleAnimationStart}
      onTransitionStart={handleAnimationStart}
      onAnimationEnd={handleAnimationEnd}
      onTransitionEnd={handleAnimationEnd}
    >
      {children}
    </Box>
  );
} 
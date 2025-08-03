import { useState, useEffect } from 'react';

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

const defaultBreakpoints: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

export const useResponsive = (breakpoints: BreakpointConfig = defaultBreakpoints): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return {
      isMobile: width <= breakpoints.mobile,
      isTablet: width > breakpoints.mobile && width <= breakpoints.tablet,
      isDesktop: width > breakpoints.tablet,
      width,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width <= breakpoints.mobile,
        isTablet: width > breakpoints.mobile && width <= breakpoints.tablet,
        isDesktop: width > breakpoints.tablet,
        width,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Déclencher une fois pour s'assurer que l'état est correct
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return state;
};

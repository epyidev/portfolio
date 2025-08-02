import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant qui remet automatiquement le scroll en haut 
 * à chaque changement de route
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Remettre le scroll en haut de la page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Animation fluide
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

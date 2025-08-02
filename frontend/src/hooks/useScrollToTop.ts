import { useEffect } from 'react';

/**
 * Hook personnalisé pour remettre le scroll en haut de la page
 * @param smooth - Si true, utilise une animation fluide
 */
export const useScrollToTop = (smooth: boolean = true) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  };

  return scrollToTop;
};

/**
 * Hook qui remet automatiquement le scroll en haut 
 * quand le composant est monté
 * @param smooth - Si true, utilise une animation fluide
 */
export const useScrollToTopOnMount = (smooth: boolean = true) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, [smooth]);
};

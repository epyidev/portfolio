import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Home, Briefcase } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Fermer le menu avec la touche Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <span className="logo-text">Pierre Lihoreau</span>
              {isAdminPage && (
                <span className="admin-badge">
                  <Shield size={12} />
                  ADMIN
                </span>
              )}
            </Link>

            {/* Navigation Desktop */}
            <nav className="nav">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Bouton menu mobile */}
            <button
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu de navigation"
              aria-expanded={isMenuOpen}
            >
              <span className="mobile-menu-icon">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay pour fermer le menu */}
      {isMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu mobile */}
      <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="mobile-menu-logo" onClick={() => setIsMenuOpen(false)}>
            <span className="logo-text">Pierre Lihoreau</span>
          </Link>
          <button
            className="mobile-menu-close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mobile-nav">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                style={{ 
                  animationDelay: isMenuOpen ? `${index * 0.1}s` : '0s'
                }}
              >
                <IconComponent size={20} />
                <span>{item.name}</span>
                {isActivePath(item.path) && (
                  <div className="mobile-nav-indicator" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mobile-menu-footer">
          <p>© 2024 Pierre Lihoreau</p>
        </div>
      </div>
    </>
  );
};

export default Header;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            Pierre Lihoreau
            {isAdminPage && (
              <span style={{ 
                marginLeft: 'var(--spacing-sm)', 
                padding: 'var(--spacing-xs) var(--spacing-sm)', 
                backgroundColor: 'var(--primary-100)', 
                color: 'var(--primary-700)', 
                borderRadius: 'var(--border-radius)', 
                fontSize: '0.75rem', 
                fontWeight: '500' 
              }}>
                <Shield size={12} style={{ marginRight: '4px', display: 'inline' }} />
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
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

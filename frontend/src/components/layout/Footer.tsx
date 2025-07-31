import React from 'react';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: Github,
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: Linkedin,
    },
    {
      name: 'Email',
      url: 'mailto:contact@example.com',
      icon: Mail,
    },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Section principale */}
          <div className="footer-section">
            <h3>Pierre Lihoreau</h3>
            <p>
              Développeur passionné spécialisé dans le développement web moderne. 
              Je crée des applications performantes et des expériences utilisateur exceptionnelles.
            </p>
            
            {/* Liens sociaux */}
            <div className="social-links">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={link.name}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Liens rapides */}
          <div className="footer-section">
            <h3>Liens rapides</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <a href="/">Accueil</a>
              <a href="/portfolio">Portfolio</a>
              <a href="/blog">Blog</a>
              <a href="/contact">Contact</a>
              <a 
                href="/admin/login" 
                style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--gray-400)', 
                  marginTop: 'var(--spacing-md)' 
                }}
              >
                Administration
              </a>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="footer-bottom">
          <div className="flex-between" style={{ flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <p>© {currentYear} Pierre Lihoreau. Tous droits réservés.</p>
            <p>
              Powered by{' '}
              <a 
                href="https://lets-pop.fr/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--primary-500)' }}
              >
                Let's PopP ! <ExternalLink size={14} style={{ display: 'inline', marginLeft: '4px' }} />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

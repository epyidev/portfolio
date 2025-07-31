import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Youtube, Twitter, Instagram, Facebook } from 'lucide-react';
import { configService } from '../../services';

const Footer: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configData = await configService.getConfig();
        setConfig(configData);
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
      }
    };

    loadConfig();
  }, []);

  // Mapping des icônes par nom
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    github: Github,
    linkedin: Linkedin,
    mail: Mail,
    youtube: Youtube,
    twitter: Twitter,
    instagram: Instagram,
    facebook: Facebook,
  };

  const socialLinks = config?.socialNetworks?.map((network: any) => ({
    name: network.name,
    url: network.url,
    icon: iconMap[network.icon.toLowerCase()] || ExternalLink,
  })) || [
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
      url: `mailto:${config?.homePage?.contactEmail || 'contact@example.com'}`,
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
              {socialLinks.map((link: { name: string; url: string; icon: React.ComponentType<any> }) => {
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
                Let's PoP !
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

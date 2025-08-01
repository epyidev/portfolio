import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Mail, ExternalLink, Youtube, Twitter, Instagram, Facebook } from 'lucide-react';
import { configService } from '../../services';

const Footer: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const navigate = useNavigate();
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
              {config?.homePage?.shortDescription || 'Développeur passionné spécialisé dans le développement web moderne. Je crée des applications performantes et des expériences utilisateur exceptionnelles.'}
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
            <div className="footer-links">
              <button 
                onClick={() => navigate('/')}
                className="footer-nav-button"
              >
                Accueil
              </button>
              <button 
                onClick={() => navigate('/portfolio')}
                className="footer-nav-button"
              >
                Portfolio
              </button>
              <button 
                onClick={() => navigate('/admin/login')}
                className="footer-nav-button admin-link"
              >
                Administration
              </button>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© {currentYear} Pierre Lihoreau. Tous droits réservés.</p>
            <p>
              Powered by{' '}
              <a 
                href="https://lets-pop.fr/" 
                target="_blank" 
                rel="noopener noreferrer"
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

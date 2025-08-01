import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button, LoadingSpinner } from '../components/UI';
import projectService from '../services/projectService';
import configService from '../services/configService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Config } from '../types';

const HomePage: React.FC = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useDocumentTitle('Accueil');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [, siteConfig] = await Promise.all([
          projectService.getProjects(),
          configService.getConfig(),
        ]);
        
        setConfig(siteConfig);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Section Hero */}
      <section className="hero center">
        <div className="container">
          <h1>{config?.homePage?.greeting || 'Bonjour, je suis Pierre Lihoreau'}</h1>
          <p>
            {config?.homePage?.shortDescription || 'Développeur Full Stack passionné par la création d\'applications web modernes et performantes. Je transforme vos idées en solutions digitales innovantes.'}
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="outline" 
              size="lg" 
              icon={Download} 
              onClick={() => window.open('/api/cv/download', '_blank')}
            >
              Télécharger mon CV
            </Button>
            <Button variant="outline" size="lg" icon={ArrowRight} iconPosition="right" onClick={() => {
                navigate('/portfolio');
            }}>
                Voir mes projets
            </Button>
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section className="section">
        <div className="container">
          <div className="prose" style={{ maxWidth: 'none' }}>
            {config?.homePage?.markdownContent ? (
              <ReactMarkdown>{config.homePage.markdownContent}</ReactMarkdown>
            ) : (
              <div>
                <h2>À propos de moi</h2>
                <p>
                  Développeur Full Stack passionné avec plus de 3 ans d'expérience dans la création 
                  d'applications web modernes. Je me spécialise dans l'écosystème JavaScript/TypeScript, 
                  avec une expertise particulière en React, Node.js et les architectures cloud.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

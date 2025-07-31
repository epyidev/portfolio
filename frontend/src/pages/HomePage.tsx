import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, ExternalLink, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button, Card, LoadingSpinner } from '../components/UI';
import projectService from '../services/projectService';
import configService from '../services/configService';
import type { Project, Config } from '../types';

const HomePage: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, siteConfig] = await Promise.all([
          projectService.getProjects(),
          configService.getConfig(),
        ]);
        
        // Prendre les 3 premiers projets
        setFeaturedProjects(projects.slice(0, 3));
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
      <section className="hero">
        <div className="container">
          <h1>{config?.homePage?.greeting || 'Bonjour, je suis Pierre Lihoreau'}</h1>
          <p>
            {config?.homePage?.shortDescription || 'Développeur Full Stack passionné par la création d\'applications web modernes et performantes. Je transforme vos idées en solutions digitales innovantes.'}
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="secondary" 
              size="lg" 
              icon={Download} 
              onClick={() => window.open('/api/cv/download', '_blank')}
            >
              Télécharger mon CV
            </Button>
            <Link to="/portfolio">
              <Button variant="outline" size="lg" icon={ArrowRight} iconPosition="right">
                Voir mes projets
              </Button>
            </Link>
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

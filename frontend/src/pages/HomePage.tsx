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

      {/* Section Projets en vedette */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-title">
            <h2>Projets en vedette</h2>
            <p>
              Découvrez quelques-uns de mes projets récents qui démontrent mes compétences 
              et ma passion pour le développement web.
            </p>
          </div>
          
          <div className="grid grid-3 gap-lg">
            {featuredProjects.map((project) => (
              <Card key={project.id} hover>
                <div style={{ 
                  aspectRatio: '16/9', 
                  backgroundColor: 'var(--gray-200)', 
                  borderRadius: 'var(--border-radius)', 
                  marginBottom: 'var(--spacing-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gray-400)'
                }}>
                  {project.imageUrl || project.thumbnail ? (
                    <img
                      src={project.imageUrl || project.thumbnail}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--border-radius)' }}
                    />
                  ) : (
                    <span>Pas d'image</span>
                  )}
                </div>
                <h3>{project.title}</h3>
                <p>{project.description || project.shortDescription}</p>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                  <Button variant="outline" size="sm" icon={ExternalLink}>
                    Demo
                  </Button>
                  <Button variant="ghost" size="sm" icon={Github}>
                    Code
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center" style={{ marginTop: 'var(--spacing-2xl)' }}>
            <Link to="/portfolio">
              <Button icon={ArrowRight} iconPosition="right">
                Voir tous les projets
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

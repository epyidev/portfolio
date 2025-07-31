import React, { useEffect, useState } from 'react';
import { ExternalLink, Github, Search, Filter } from 'lucide-react';
import { Button, Card, LoadingSpinner, Input } from '../components/UI';
import projectService from '../services/projectService';
import type { Project } from '../types';

const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await projectService.getProjects();
        // Transformer les données pour correspondre à l'interface
        const transformedProjects = projectsData.map(project => ({
          ...project,
          description: project.shortDescription,
          content: project.longDescription,
          technologies: [], // À remplir selon les données réelles
          imageUrl: project.thumbnail,
          featured: project.order <= 3, // Les 3 premiers sont en vedette
        }));
        setProjects(transformedProjects);
        setFilteredProjects(transformedProjects);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Extraction des technologies uniques
  const allTechnologies = React.useMemo(() => {
    const techs = new Set<string>();
    projects.forEach(project => {
      project.technologies?.forEach(tech => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, [projects]);

  // Filtrage des projets
  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTechnology) {
      filtered = filtered.filter(project =>
        project.technologies?.includes(selectedTechnology)
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedTechnology]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Mon Portfolio</h1>
          <p>
            Découvrez mes projets les plus récents et explorez les technologies 
            que j'utilise pour créer des applications web modernes et performantes.
          </p>
        </div>
      </section>

      {/* Filtres et Recherche */}
      <section style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        borderBottom: '1px solid var(--gray-200)' 
      }}>
        <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'var(--spacing-md)', 
            alignItems: 'center' 
          }}>
            <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
              <Input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--gray-400)' 
                }} 
                size={20} 
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Filter size={20} style={{ color: 'var(--gray-400)' }} />
                <select
                  value={selectedTechnology}
                  onChange={(e) => setSelectedTechnology(e.target.value)}
                  style={{ 
                    border: '1px solid var(--gray-300)', 
                    borderRadius: 'var(--border-radius)', 
                    padding: 'var(--spacing-sm) var(--spacing-md)', 
                    outline: 'none' 
                  }}
                >
                  <option value="">Toutes les technologies</option>
                  {allTechnologies.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>
              
              {(searchTerm || selectedTechnology) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTechnology('');
                  }}
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>
          
          <div style={{ 
            marginTop: 'var(--spacing-md)', 
            fontSize: '0.875rem', 
            color: 'var(--gray-600)' 
          }}>
            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Grille des Projets */}
      <section className="section">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--spacing-4xl) 0' }}>
              <div style={{ color: 'var(--gray-400)', marginBottom: 'var(--spacing-md)' }}>
                <Search size={48} style={{ margin: '0 auto' }} />
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '500', 
                marginBottom: 'var(--spacing-sm)' 
              }}>
                Aucun projet trouvé
              </h3>
              <p className="text-gray">
                Essayez de modifier vos critères de recherche ou de supprimer les filtres.
              </p>
            </div>
          ) : (
            <div className="grid grid-3 gap-2xl">
              {filteredProjects.map((project) => (
                <div key={project.id} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Card hover>
                    {/* Image du projet */}
                    <div style={{ 
                      aspectRatio: '16/9', 
                      backgroundColor: 'var(--gray-200)', 
                      borderRadius: 'var(--border-radius)', 
                      marginBottom: 'var(--spacing-md)', 
                      overflow: 'hidden' 
                    }}>
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover', 
                          transition: 'transform 0.3s ease' 
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--gray-400);">
                                <svg style="width: 48px; height: 48px;" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                </svg>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'var(--gray-400)' 
                      }}>
                        <svg style={{ width: '48px', height: '48px' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Contenu du projet */}
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '600', 
                      marginBottom: 'var(--spacing-sm)' 
                    }}>
                      {project.title}
                    </h3>
                    <p style={{ 
                      color: 'var(--gray-600)', 
                      marginBottom: 'var(--spacing-md)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 'var(--spacing-sm)', 
                        marginBottom: 'var(--spacing-md)' 
                      }}>
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            style={{ 
                              padding: 'var(--spacing-xs) var(--spacing-sm)', 
                              backgroundColor: 'var(--primary-100)', 
                              color: 'var(--primary-800)', 
                              fontSize: '0.875rem', 
                              borderRadius: '9999px' 
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--spacing-sm)', 
                    paddingTop: 'var(--spacing-md)' 
                  }}>
                    {project.demoUrl && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={ExternalLink}
                        style={{ flex: 1 }}
                        onClick={() => window.open(project.demoUrl, '_blank')}
                      >
                        Démo
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Github}
                        style={{ flex: 1 }}
                        onClick={() => window.open(project.githubUrl, '_blank')}
                      >
                        Code
                      </Button>
                    )}
                    {!project.demoUrl && !project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ flex: 1 }}
                        disabled
                      >
                        Bientôt disponible
                      </Button>
                    )}
                  </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section CTA */}
      <section className="hero">
        <div className="container">
          <h2>Un projet en tête ?</h2>
          <p>
            Je suis toujours intéressé par de nouveaux défis et de nouvelles collaborations. 
            N'hésitez pas à me contacter pour discuter de votre projet.
          </p>
          <a href="mailto:contact@example.com">
            <Button variant="secondary" size="lg">
              Discutons de votre projet
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;

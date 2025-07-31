import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag } from 'lucide-react';
import { Button, Card, LoadingSpinner, Input } from '../components/UI';
import projectService from '../services/projectService';
import { getImageUrl } from '../services/api';
import type { Project } from '../types';

const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await projectService.getProjects();
        setProjects(projectsData);
        setFilteredProjects(projectsData);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filtrage des projets
  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

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
            <div style={{ 
              flex: 1, 
              maxWidth: '500px', 
              position: 'relative',
              width: '100%'
            }}>
              <div style={{ position: 'relative' }}>
                <Search 
                  style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'var(--gray-400)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }} 
                  size={20} 
                />
                <Input
                  type="text"
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    paddingLeft: '48px',
                    fontSize: '1rem',
                    height: '48px',
                    borderRadius: '12px',
                    border: '2px solid var(--gray-200)',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-500)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
                  }}
                />
              </div>
            </div>
            
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--gray-600)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: '8px'
                }}
              >
                Effacer la recherche
              </Button>
            )}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
              {filteredProjects.map((project) => (
                <Link key={project.id} to={`/portfolio/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card hover>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'flex-start' }}>
                      {/* Image du projet */}
                      <div style={{ 
                        width: '200px',
                        height: '140px',
                        backgroundColor: 'var(--gray-200)', 
                        borderRadius: 'var(--border-radius)', 
                        flexShrink: 0,
                        overflow: 'hidden' 
                      }}>
                      {project.thumbnail ? (
                        <img
                          src={getImageUrl(project.thumbnail)}
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
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '600', 
                          marginBottom: 'var(--spacing-sm)' 
                        }}>
                          {project.title}
                        </h3>
                        <p style={{ 
                          color: 'var(--gray-600)', 
                          marginBottom: 'var(--spacing-md)',
                          fontSize: '1rem',
                          lineHeight: '1.6'
                        }}>
                          {project.shortDescription}
                        </p>
                        
                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 'var(--spacing-sm)' 
                          }}>
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{ 
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 'var(--spacing-xs)',
                                  padding: 'var(--spacing-xs) var(--spacing-sm)', 
                                  backgroundColor: 'var(--gray-100)', 
                                  color: 'var(--gray-700)', 
                                  fontSize: '0.75rem', 
                                  borderRadius: '9999px' 
                                }}
                              >
                                <Tag size={10} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag } from 'lucide-react';
import { Card, LoadingSpinner, Input } from '../components/UI';
import projectService from '../services/projectService';
import configService from '../services/configService';
import { getImageUrl } from '../services/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSEO } from '../hooks/useSEO';
import type { Project, Config } from '../types';

const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useDocumentTitle('Portfolio');

  // SEO pour la page portfolio
  useSEO({
    title: 'Portfolio - Pierre Lihoreau | Projets Audiovisuel & Développement',
    description: 'Découvrez les projets de Pierre Lihoreau : productions audiovisuelles, développement web, applications React/TypeScript et designs UI/UX.',
    keywords: `Pierre Lihoreau, Portfolio, Projets, Audiovisuel, Production Vidéo, ${availableTags.join(', ')}, Développement Web, React, TypeScript, UI/UX Design`,
    ogTitle: 'Portfolio - Pierre Lihoreau | Projets Audiovisuel & Développement',
    ogDescription: 'Découvrez mes projets de production audiovisuelle, développement web et UI/UX design.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": "Portfolio Pierre Lihoreau",
      "description": "Collection des projets et réalisations audiovisuelles et de développement de Pierre Lihoreau",
      "author": {
        "@type": "Person",
        "name": "Pierre Lihoreau"
      },
      "keywords": availableTags.join(', ')
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, siteConfig] = await Promise.all([
          projectService.getProjects(),
          configService.getConfig(),
        ]);
        setProjects(projectsData);
        setFilteredProjects(projectsData);
        setConfig(siteConfig);
        
        // Extraire tous les tags uniques des projets
        const allTags = projectsData.reduce((tags: string[], project) => {
          if (project.tags) {
            project.tags.forEach(tag => {
              if (!tags.includes(tag)) {
                tags.push(tag);
              }
            });
          }
          return tags;
        }, []);
        setAvailableTags(allTags.sort());
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrage des projets
  useEffect(() => {
    let filtered = projects;

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrage par tags sélectionnés
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        project.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedTags]);

  // Gestion de la sélection/désélection des tags
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Effacer tous les filtres
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section 
        className="hero center"
        style={config?.portfolioPage?.heroBackgroundImage ? {
          backgroundImage: `url(${getImageUrl(config.portfolioPage.heroBackgroundImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}}
      >
        <div className="container">
          <h1>Mon Portfolio</h1>
          <p>
            Découvrez mes réalisations que j'ai pu faire lors de mes différentes expériences professionnelles et projets personnels.
          </p>
        </div>
      </section>

      {/* Filtres et Recherche */}
      <section style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        border: 'none',
        borderBottom: '1px solid var(--border-primary)',
        paddingTop: '40px',
        paddingBottom: '40px'
      }}>
        <div className="container">
          {/* Barre de recherche */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: 'var(--spacing-md)', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div style={{ 
              flex: 1, 
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
                    color: 'var(--text-muted)',
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
                  className="search-input"
                  style={{
                    paddingLeft: '48px',
                    fontSize: '1rem',
                    height: '48px',
                    borderRadius: 'var(--border-radius)',
                    border: `var(--border-width) solid var(--border-primary)`,
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    transition: 'var(--transition-normal)',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--border-secondary)';
                    e.target.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-primary)';
                    e.target.style.backgroundColor = 'var(--bg-tertiary)';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section des tags */}
          {availableTags.length > 0 && (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-md)' 
              }}>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: 'var(--text-secondary)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Filtrer par catégorie
                </h4>
                {(selectedTags.length > 0 || searchTerm) && (
                  <button
                    onClick={clearAllFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 'var(--spacing-sm)' 
              }}>
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        backgroundColor: 'var(--bg-tertiary)',
                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        border: `var(--border-width) solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                        borderRadius: 'var(--border-radius)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-normal)',
                        outline: 'none',
                        boxShadow: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--border-secondary)';
                        } else {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--border-primary)';
                        } else {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <Tag size={12} />
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grille des Projets */}
      <section className="section">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--spacing-4xl) 0' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>
                <Search size={48} style={{ margin: '0 auto' }} />
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '500', 
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--text-primary)'
              }}>
                Aucun projet trouvé
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                {searchTerm || selectedTags.length > 0 
                  ? 'Essayez de modifier vos critères de recherche ou de supprimer les filtres.'
                  : 'Aucun projet disponible pour le moment.'
                }
              </p>
              {(searchTerm || selectedTags.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Effacer tous les filtres
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
              {filteredProjects.map((project) => (
                <Link key={project.id} to={`/portfolio/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card hover>
                    <div 
                      className="project-card-content"
                      style={{ 
                        display: 'flex', 
                        gap: 'var(--spacing-lg)', 
                        alignItems: 'flex-start'
                      }}
                    >
                      {/* Image du projet */}
                      <div 
                        className="project-thumbnail"
                        style={{ 
                          width: '200px',
                          height: '140px',
                          backgroundColor: 'var(--bg-tertiary)', 
                          border: `var(--border-width) solid var(--border-primary)`,
                          borderRadius: 'var(--border-radius)', 
                          flexShrink: 0,
                          overflow: 'hidden' 
                        }}
                      >
                      {project.thumbnail ? (
                        <img
                          src={getImageUrl(project.thumbnail)}
                          alt={`Aperçu du projet ${project.title} - ${project.shortDescription}`}
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
                                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
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
                          color: 'var(--text-muted)' 
                        }}>
                          <svg style={{ width: '48px', height: '48px' }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      </div>

                      {/* Contenu du projet */}
                      <div className="project-content" style={{ flex: 1 }}>
                        <h3 
                          className="project-title"
                          style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: '600', 
                            marginBottom: 'var(--spacing-sm)',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-serif)'
                          }}
                        >
                          {project.title}
                        </h3>
                        <p 
                          className="project-description"
                          style={{ 
                            color: 'var(--text-secondary)', 
                            marginBottom: 'var(--spacing-md)',
                            fontSize: '1rem',
                            lineHeight: '1.6'
                          }}
                        >
                          {project.shortDescription}
                        </p>
                        
                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="project-tags" style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 'var(--spacing-sm)' 
                          }}>
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="project-tag"
                                style={{ 
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 'var(--spacing-xs)',
                                  padding: 'var(--spacing-xs) var(--spacing-sm)', 
                                  backgroundColor: 'var(--bg-tertiary)', 
                                  color: 'var(--text-secondary)', 
                                  fontSize: '0.75rem',
                                  border: `var(--border-width) solid var(--border-primary)`,
                                  borderRadius: 'var(--border-radius)' 
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

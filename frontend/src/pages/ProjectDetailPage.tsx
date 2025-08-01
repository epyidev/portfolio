import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Project } from '../types';
import projectService from '../services/projectService';
import { getImageUrl } from '../services/api';
import { LoadingSpinner } from '../components/UI';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        const projectData = await projectService.getProject(id);
        setProject(projectData);
      } catch (err) {
        setError('Projet non trouvé');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            marginBottom: 'var(--spacing-md)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-serif)'
          }}>
            Projet non trouvé
          </h1>
          <p style={{ 
            marginBottom: 'var(--spacing-md)',
            color: 'var(--text-secondary)'
          }}>
            {error}
          </p>
          <Link to="/portfolio" className="btn btn-outline">
            Retour au portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        <Link 
          to="/portfolio" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-xs)', 
            color: 'var(--text-secondary)', 
            textDecoration: 'none',
            marginBottom: 'var(--spacing-2xl)',
            transition: 'var(--transition-normal)',
            fontSize: '0.95rem',
            border: `var(--border-width) solid var(--border-primary)`,
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--border-radius)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-secondary)';
            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft size={20} />
          <span>Retour au portfolio</span>
        </Link>

        <article style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          border: `var(--border-width) solid var(--border-primary)`,
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-2xl)',
        }}>
          {project.thumbnail && (
            <img
              src={getImageUrl(project.thumbnail)}
              alt={project.title}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: 'var(--border-radius)',
                marginBottom: 'var(--spacing-2xl)',
                border: `var(--border-width) solid var(--border-primary)`
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
          
          <header style={{ marginBottom: 'var(--spacing-2xl)' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: 'var(--spacing-md)',
              lineHeight: '1.2',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-serif)'
            }}>
              {project.title}
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-secondary)', 
              marginBottom: 'var(--spacing-lg)',
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
                      padding: 'var(--spacing-sm) var(--spacing-md)', 
                      backgroundColor: 'var(--bg-tertiary)', 
                      color: 'var(--text-secondary)', 
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      border: `var(--border-width) solid var(--border-primary)`,
                      borderRadius: 'var(--border-radius)' 
                    }}
                  >
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          
          <div 
            className="markdown-content"
            style={{ 
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: 'var(--text-primary)'
            }}
          >
            <ReactMarkdown>
              {project.longDescription || project.content || 'Aucune description détaillée disponible.'}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

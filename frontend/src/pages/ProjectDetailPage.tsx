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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
            Projet non trouvé
          </h1>
          <p className="text-gray" style={{ marginBottom: 'var(--spacing-md)' }}>{error}</p>
          <Link to="/portfolio" className="btn btn-primary">
            Retour au portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <div className="container" style={{ maxWidth: '1024px', padding: 'var(--spacing-2xl) var(--spacing-md)' }}>
        <Link 
          to="/portfolio" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-xs)', 
            color: 'var(--primary-600)', 
            textDecoration: 'none',
            marginBottom: 'var(--spacing-2xl)',
            transition: 'color 0.2s ease',
            fontSize: '0.95rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-700)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
        >
          <ArrowLeft size={20} />
          <span>Retour au portfolio</span>
        </Link>

        <article style={{ 
          backgroundColor: 'white', 
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-2xl)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
                marginBottom: 'var(--spacing-2xl)'
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
              lineHeight: '1.2'
            }}>
              {project.title}
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--gray-600)', 
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
                      backgroundColor: 'var(--primary-100)', 
                      color: 'var(--primary-800)', 
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      borderRadius: '9999px' 
                    }}
                  >
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          
          <div style={{ 
            fontSize: '1.1rem',
            lineHeight: '1.7',
            color: 'var(--gray-800)'
          }}>
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

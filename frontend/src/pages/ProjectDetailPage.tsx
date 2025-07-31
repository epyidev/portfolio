import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Project } from '../types';
import projectService from '../services/projectService';
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
    <div style={{ minHeight: '100vh', padding: 'var(--spacing-3xl) 0' }}>
      <div className="container" style={{ maxWidth: '1024px' }}>
        <Link 
          to="/portfolio" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-xs)', 
            color: 'var(--primary-600)', 
            textDecoration: 'none',
            marginBottom: 'var(--spacing-2xl)',
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-700)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
        >
          <ArrowLeft size={20} />
          <span>Retour au portfolio</span>
        </Link>

        <article className="card">
          {project.thumbnail && (
            <img
              src={`http://localhost:3001${project.thumbnail}`}
              alt={project.title}
              style={{
                width: '100%',
                height: '256px',
                objectFit: 'cover',
                borderRadius: 'var(--border-radius)',
                marginBottom: 'var(--spacing-xl)'
              }}
            />
          )}
          
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            marginBottom: 'var(--spacing-md)' 
          }}>
            {project.title}
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--gray-600)', 
            marginBottom: 'var(--spacing-2xl)' 
          }}>
            {project.shortDescription}
          </p>
          
          <div className="markdown-content">
            <ReactMarkdown>
              {project.longDescription}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

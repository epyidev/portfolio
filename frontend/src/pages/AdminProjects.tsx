import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, LoadingSpinner } from '../components/UI';
import projectService from '../services/projectService';
import type { Project } from '../types';

const AdminProjects: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  if (authLoading) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectsData = await projectService.getAllProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }
    
    try {
      await projectService.deleteProject(id);
      await fetchProjects();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du projet');
    }
  };

  const handleToggleVisibility = async (project: Project) => {
    try {
      const formData = new FormData();
      formData.append('title', project.title);
      formData.append('shortDescription', project.shortDescription);
      formData.append('longDescription', project.longDescription);
      formData.append('visibility', project.visibility === 'public' ? 'private' : 'public');
      formData.append('order', project.order?.toString() || '0');
      if (project.demoUrl) formData.append('demoUrl', project.demoUrl);
      if (project.githubUrl) formData.append('githubUrl', project.githubUrl);
      
      await projectService.updateProject(project.id, formData);
      await fetchProjects();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la visibilité');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="hero">
        <div className="container">
          <div className="flex-between">
            <div>
              <Link to="/admin" style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-xs)', 
                color: 'var(--primary-100)', 
                textDecoration: 'none',
                marginBottom: 'var(--spacing-md)'
              }}>
                <ArrowLeft size={16} />
                Retour au dashboard
              </Link>
              <h1>Gestion des projets</h1>
              <p>Créez et gérez vos projets portfolio</p>
            </div>
            <Button 
              variant="secondary" 
              icon={Plus}
              onClick={() => window.location.href = '/admin/projects/new'}
            >
              Nouveau projet
            </Button>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="section">
        <div className="container">
          {projects.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
                <h3>Aucun projet pour le moment</h3>
                <p className="text-gray" style={{ marginBottom: 'var(--spacing-lg)' }}>
                  Commencez par créer votre premier projet portfolio
                </p>
                <Button 
                  variant="primary" 
                  icon={Plus}
                  onClick={() => window.location.href = '/admin/projects/new'}
                >
                  Créer mon premier projet
                </Button>
              </div>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {projects.map((project, index) => (
                <Card key={project.id}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'flex-start' }}>
                    {/* Image du projet */}
                    <div style={{ 
                      width: '120px', 
                      height: '80px', 
                      backgroundColor: 'var(--gray-200)', 
                      borderRadius: 'var(--border-radius)', 
                      flexShrink: 0,
                      overflow: 'hidden'
                    }}>
                      {project.thumbnail ? (
                        <img
                          src={`http://localhost:3001${project.thumbnail}`}
                          alt={project.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                          Pas d'image
                        </div>
                      )}
                    </div>

                    {/* Informations du projet */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>{project.title}</h3>
                          <p className="text-gray" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            {project.shortDescription}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <span style={{ 
                              fontSize: '0.875rem',
                              padding: 'var(--spacing-xs) var(--spacing-sm)',
                              backgroundColor: project.visibility === 'public' ? 'var(--green-100)' : 'var(--gray-100)',
                              color: project.visibility === 'public' ? 'var(--green-700)' : 'var(--gray-700)',
                              borderRadius: 'var(--border-radius)'
                            }}>
                              {project.visibility === 'public' ? 'Public' : 'Privé'}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                              Ordre: {project.order || index + 1}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={project.visibility === 'public' ? Eye : EyeOff}
                            onClick={() => handleToggleVisibility(project)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit}
                            onClick={() => window.location.href = `/admin/projects/${project.id}/edit`}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDeleteProject(project.id)}
                            style={{ color: 'var(--red-600)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminProjects;

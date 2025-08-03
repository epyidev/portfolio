import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, LoadingSpinner, Modal } from '../components/UI';
import ProjectForm from '../components/ProjectForm';
import projectService from '../services/projectService';
import { getImageUrl } from '../services/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useResponsive } from '../hooks/useResponsive';
import type { Project } from '../types';

const AdminProjects: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isMobile } = useResponsive();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useDocumentTitle('Administration - Projets');

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
      // Trier par ordre croissant pour l'affichage
      const sortedProjects = projectsData.sort((a, b) => (a.order || 0) - (b.order || 0));
      setProjects(sortedProjects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Recalculer et sauvegarder l'ordre des projets
  const updateProjectsOrder = async (newProjects: Project[]) => {
    try {
      const projectsWithNewOrder = newProjects.map((project, index) => ({
        ...project,
        order: index + 1
      }));

      // Mettre à jour chaque projet avec son nouvel ordre
      await Promise.all(
        projectsWithNewOrder.map(async (project) => {
          const formData = new FormData();
          formData.append('title', project.title);
          formData.append('shortDescription', project.shortDescription);
          formData.append('longDescription', project.longDescription);
          formData.append('tags', JSON.stringify(project.tags || []));
          formData.append('visibility', project.visibility);
          formData.append('order', project.order.toString());
          
          return projectService.updateProject(project.id, formData);
        })
      );

      setProjects(projectsWithNewOrder);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'ordre:', error);
      alert('Erreur lors de la mise à jour de l\'ordre des projets');
    }
  };

  // Déplacer un projet vers le haut
  const moveProjectUp = async (projectId: string) => {
    const index = projects.findIndex(p => p.id === projectId);
    if (index === 0) return; // Déjà en haut
    
    const newProjects = [...projects];
    [newProjects[index], newProjects[index - 1]] = [newProjects[index - 1], newProjects[index]];
    
    await updateProjectsOrder(newProjects);
  };

  // Déplacer un projet vers le bas
  const moveProjectDown = async (projectId: string) => {
    const index = projects.findIndex(p => p.id === projectId);
    if (index === projects.length - 1) return; // Déjà en bas
    
    const newProjects = [...projects];
    [newProjects[index], newProjects[index + 1]] = [newProjects[index + 1], newProjects[index]];
    
    await updateProjectsOrder(newProjects);
  };

  // Gérer le début du drag
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  };

  // Gérer le drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  // Gérer le drop
  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newProjects = [...projects];
    const draggedProject = newProjects[draggedIndex];
    
    // Supprimer le projet de sa position actuelle
    newProjects.splice(draggedIndex, 1);
    
    // L'insérer à la nouvelle position
    newProjects.splice(dropIndex, 0, draggedProject);
    
    await updateProjectsOrder(newProjects);
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Gérer la fin du drag
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
      // Cycle entre les 3 états : public -> unlisted -> private -> public
      let newVisibility: 'public' | 'unlisted' | 'private';
      if (project.visibility === 'public') {
        newVisibility = 'unlisted';
      } else if (project.visibility === 'unlisted') {
        newVisibility = 'private';
      } else {
        newVisibility = 'public';
      }

      const formData = new FormData();
      formData.append('title', project.title);
      formData.append('shortDescription', project.shortDescription);
      formData.append('longDescription', project.longDescription);
      formData.append('tags', JSON.stringify(project.tags || []));
      formData.append('visibility', newVisibility);
      formData.append('order', project.order?.toString() || '0');
      
      await projectService.updateProject(project.id, formData);
      await fetchProjects();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la visibilité');
    }
  };

  const handleCreateProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setEditingProject(null);
  };

  const handleProjectSaved = async () => {
    await fetchProjects();
    handleCloseModals();
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
                color: 'var(--text-secondary)', 
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
              onClick={handleCreateProject}
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
                  onClick={handleCreateProject}
                >
                  Créer mon premier projet
                </Button>
              </div>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  style={{
                    cursor: 'grab',
                    opacity: draggedIndex === index ? 0.5 : 1,
                    backgroundColor: dragOverIndex === index ? 'var(--bg-hover)' : 'var(--bg-secondary)',
                    transition: 'all 0.2s ease',
                    border: dragOverIndex === index ? '2px dashed var(--accent-primary)' : 'var(--border-width) solid var(--border-primary)',
                    borderRadius: 'var(--border-radius)',
                    padding: 'var(--spacing-lg)'
                  }}
                  draggable
                  onDragStart={(e: React.DragEvent) => handleDragStart(e, index)}
                  onDragOver={(e: React.DragEvent) => handleDragOver(e, index)}
                  onDrop={(e: React.DragEvent) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--spacing-lg)', 
                    alignItems: 'flex-start',
                    flexDirection: isMobile ? 'column' : 'row'
                  }}>
                    {/* Contrôles de réorganisation */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'row' : 'column',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      paddingTop: isMobile ? '0' : 'var(--spacing-sm)',
                      justifyContent: isMobile ? 'space-between' : 'flex-start',
                      width: isMobile ? '100%' : 'auto',
                      borderBottom: isMobile ? '1px solid var(--border-primary)' : 'none',
                      paddingBottom: isMobile ? 'var(--spacing-sm)' : '0',
                      marginBottom: isMobile ? 'var(--spacing-sm)' : '0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <GripVertical 
                          size={16} 
                          style={{ 
                            color: 'var(--text-muted)', 
                            cursor: 'grab'
                          }} 
                        />
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          fontWeight: '600'
                        }}>
                          Position #{index + 1}
                        </span>
                      </div>
                      
                      {/* Boutons Monter/Descendre */}
                      <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--spacing-xs)' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={ChevronUp}
                          onClick={() => moveProjectUp(project.id)}
                          disabled={index === 0}
                          style={{ 
                            minWidth: '32px', 
                            height: '32px', 
                            padding: '4px',
                            opacity: index === 0 ? 0.3 : 1
                          }}
                          title="Monter"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={ChevronDown}
                          onClick={() => moveProjectDown(project.id)}
                          disabled={index === projects.length - 1}
                          style={{ 
                            minWidth: '32px', 
                            height: '32px', 
                            padding: '4px',
                            opacity: index === projects.length - 1 ? 0.3 : 1
                          }}
                          title="Descendre"
                        />
                      </div>
                    </div>

                    {/* Contenu principal */}
                    <div style={{ 
                      display: 'flex', 
                      gap: 'var(--spacing-lg)', 
                      alignItems: 'flex-start',
                      flex: 1,
                      flexDirection: isMobile ? 'column' : 'row'
                    }}>
                      {/* Image du projet */}
                      <div style={{ 
                        width: isMobile ? '100%' : '120px', 
                        height: isMobile ? '200px' : '80px', 
                        backgroundColor: 'var(--gray-200)', 
                        borderRadius: 'var(--border-radius)', 
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        {project.thumbnail ? (
                          <img
                            src={getImageUrl(project.thumbnail)}
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
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          justifyContent: 'space-between',
                          flexDirection: isMobile ? 'column' : 'row',
                          gap: isMobile ? 'var(--spacing-md)' : '0'
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ 
                              marginBottom: 'var(--spacing-xs)',
                              fontSize: isMobile ? '1.25rem' : '1.5rem',
                              wordBreak: 'break-word'
                            }}>{project.title}</h3>
                            <p className="text-gray" style={{ 
                              marginBottom: 'var(--spacing-sm)',
                              wordBreak: 'break-word',
                              lineHeight: '1.5'
                            }}>
                              {project.shortDescription}
                            </p>
                            {project.tags && project.tags.length > 0 && (
                              <div style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 'var(--spacing-xs)', 
                                marginBottom: 'var(--spacing-sm)' 
                              }}>
                                {project.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    style={{
                                      fontSize: '0.75rem',
                                      padding: '2px var(--spacing-xs)',
                                      backgroundColor: 'var(--gray-100)',
                                      color: 'var(--gray-600)',
                                      borderRadius: 'var(--border-radius)',
                                      border: '1px solid var(--gray-200)',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {project.tags.length > 3 && (
                                  <span style={{ 
                                    fontSize: '0.75rem', 
                                    color: 'var(--gray-500)' 
                                  }}>
                                    +{project.tags.length - 3} autres
                                  </span>
                                )}
                              </div>
                            )}
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 'var(--spacing-md)',
                              flexWrap: 'wrap'
                            }}>
                              <span style={{ 
                                fontSize: '0.875rem',
                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                backgroundColor: 
                                  project.visibility === 'public' ? 'var(--green-100)' : 
                                  project.visibility === 'unlisted' ? 'var(--yellow-100)' : 
                                  'var(--gray-100)',
                                color: 
                                  project.visibility === 'public' ? 'var(--green-700)' : 
                                  project.visibility === 'unlisted' ? 'var(--yellow-700)' : 
                                  'var(--gray-700)',
                                borderRadius: 'var(--border-radius)',
                                whiteSpace: 'nowrap'
                              }}>
                                {project.visibility === 'public' ? 'Public' : 
                                 project.visibility === 'unlisted' ? 'Non répertorié' : 
                                 'Privé'}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ 
                            display: 'flex', 
                            gap: 'var(--spacing-xs)',
                            flexShrink: 0,
                            alignSelf: isMobile ? 'stretch' : 'flex-start',
                            justifyContent: isMobile ? 'center' : 'flex-start'
                          }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={project.visibility === 'public' ? Eye : EyeOff}
                              onClick={() => handleToggleVisibility(project)}
                              title={`Visibilité: ${project.visibility}`}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Edit}
                              onClick={() => handleEditProject(project)}
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de création */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        title="Créer un nouveau projet"
        size="lg"
      >
        <ProjectForm
          onSave={handleProjectSaved}
          onCancel={handleCloseModals}
        />
      </Modal>

      {/* Modal d'édition */}
      <Modal
        isOpen={!!editingProject}
        onClose={handleCloseModals}
        title="Modifier le projet"
        size="lg"
      >
        {editingProject && (
          <ProjectForm
            project={editingProject}
            onSave={handleProjectSaved}
            onCancel={handleCloseModals}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminProjects;

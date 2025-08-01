import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit3, Trash2, Eye, EyeOff, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, LoadingSpinner } from '../components/UI';
import blogService from '../services/blogService';
import type { BlogPost } from '../types';

const AdminBlog: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);

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
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await blogService.getAllBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      await blogService.updateBlogPost(id, { published: !published });
      await fetchPosts();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de l\'article');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      await blogService.deleteBlogPost(id);
      await fetchPosts();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'article');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1>Gestion des articles</h1>
                <p>Gérez vos articles de blog</p>
              </div>
              <Link to="/admin/blog/new">
                <Button
                  variant="primary"
                  icon={Plus}
                >
                  Nouvel article
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="section">
        <div className="container">
          {posts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {posts.map((post) => (
                <Card key={post.id}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                    {/* Contenu principal */}
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                        <h3 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>
                          {post.title}
                        </h3>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--spacing-md)', 
                          fontSize: '0.875rem', 
                          color: 'var(--gray-600)' 
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                            <Calendar size={14} />
                            {formatDate(post.createdAt)}
                          </div>
                          {post.updatedAt && post.updatedAt !== post.createdAt && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                              <Clock size={14} />
                              Modifié le {formatDate(post.updatedAt)}
                            </div>
                          )}
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 'var(--spacing-xs)',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: post.published ? 'var(--green-100)' : 'var(--gray-100)',
                            color: post.published ? 'var(--green-800)' : 'var(--gray-600)',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                            {post.published ? 'Publié' : 'Brouillon'}
                          </div>
                        </div>
                      </div>
                      
                      <p style={{ 
                        margin: 0, 
                        color: 'var(--gray-600)', 
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {post.excerpt || post.content.substring(0, 200) + '...'}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div style={{ 
                          display: 'flex', 
                          gap: 'var(--spacing-xs)', 
                          marginTop: 'var(--spacing-sm)',
                          flexWrap: 'wrap'
                        }}>
                          {post.tags.map((tag, index) => (
                            <span 
                              key={index}
                              style={{
                                padding: '2px 8px',
                                backgroundColor: 'var(--bg-tertiary)',
                                color: 'var(--text-secondary)',
                                border: `var(--border-width) solid var(--border-primary)`,
                                borderRadius: 'var(--border-radius)',
                                fontSize: '0.75rem',
                                fontWeight: '500'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={post.published ? EyeOff : Eye}
                        onClick={() => handleTogglePublished(post.id, post.published)}
                        title={post.published ? 'Dépublier' : 'Publier'}
                      />
                      <Link to={`/admin/blog/edit/${post.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit3}
                          title="Modifier"
                        />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeletePost(post.id)}
                        style={{ color: 'var(--red-600)' }}
                        title="Supprimer"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                <h3>Aucun article</h3>
                <p className="text-gray">Commencez par créer votre premier article de blog.</p>
                <Link to="/admin/blog/new">
                  <Button
                    variant="primary"
                    icon={Plus}
                    style={{ marginTop: 'var(--spacing-lg)' }}
                  >
                    Créer le premier article
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminBlog;

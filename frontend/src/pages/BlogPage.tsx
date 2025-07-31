import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Card, LoadingSpinner } from '../components/UI';
import blogService from '../services/blogService';
import type { BlogPost } from '../types';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await blogService.getBlogPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Mon Blog</h1>
          <p>
            Découvrez mes réflexions, expériences et conseils sur le développement web, 
            les technologies modernes et les meilleures pratiques du métier.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <div className="text-center" style={{ padding: 'var(--spacing-2xl)' }}>
              <h3>Aucun article pour le moment</h3>
              <p className="text-gray">Les premiers articles arrivent bientôt !</p>
            </div>
          ) : (
            <div className="grid grid-2 gap-xl">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug || post.id}`} style={{ textDecoration: 'none' }}>
                  <Card hover>
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
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--border-radius)' }}
                        />
                      ) : (
                        <span>Pas d'image</span>
                      )}
                    </div>
                    
                    <h3>{post.title}</h3>
                    <p className="text-gray">{post.excerpt || post.shortDescription}</p>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--spacing-md)', 
                      marginTop: 'var(--spacing-md)',
                      fontSize: '0.875rem',
                      color: 'var(--gray-500)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <Calendar size={16} />
                        <span>{new Date(post.publishedAt || post.publishDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <User size={16} />
                        <span>Pierre Lihoreau</span>
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

export default BlogPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, ExternalLink, Github } from 'lucide-react';
import { Button, Card, LoadingSpinner } from '../components/UI';
import projectService from '../services/projectService';
import blogService from '../services/blogService';
import type { Project, BlogPost } from '../types';

const HomePage: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, posts] = await Promise.all([
          projectService.getProjects(),
          blogService.getBlogPosts(),
        ]);

        // Prendre les 3 premiers projets
        setFeaturedProjects(projects.slice(0, 3));
        // Prendre les 3 premiers articles de blog
        setRecentPosts(posts.slice(0, 3));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      {/* Section Hero */}
      <section className="hero">
        <div className="container">
          <h1>Bonjour, je suis Pierre Lihoreau</h1>
          <p>
            Développeur Full Stack passionné par la création d'applications web modernes et performantes. 
            Je transforme vos idées en solutions digitales innovantes.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="lg" icon={Download}>
              Télécharger mon CV
            </Button>
            <Link to="/portfolio">
              <Button variant="outline" size="lg" icon={ArrowRight} iconPosition="right">
                Voir mes projets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section À propos */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2 gap-xl" style={{ alignItems: 'center' }}>
            <div>
              <h2>À propos de moi</h2>
              <p>
                Développeur Full Stack passionné avec plus de 3 ans d'expérience dans la création 
                d'applications web modernes. Je me spécialise dans l'écosystème JavaScript/TypeScript, 
                avec une expertise particulière en React, Node.js et les architectures cloud.
              </p>
              <p>
                Mon approche combine créativité et rigueur technique pour livrer des solutions 
                performantes qui répondent aux besoins métier tout en offrant une expérience 
                utilisateur exceptionnelle.
              </p>
              
              <div className="grid grid-2 gap-md" style={{ marginTop: 'var(--spacing-xl)' }}>
                <div>
                  <h3>Frontend</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>• React / Next.js</li>
                    <li>• TypeScript</li>
                    <li>• CSS moderne</li>
                  </ul>
                </div>
                <div>
                  <h3>Backend</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>• Node.js / Express</li>
                    <li>• PostgreSQL</li>
                    <li>• API REST</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Card>
              <h3>Compétences</h3>
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--spacing-xs)' }}>
                  <span>JavaScript/TypeScript</span>
                  <span className="text-primary font-semibold">95%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gray-200)', borderRadius: '4px' }}>
                  <div style={{ width: '95%', height: '100%', backgroundColor: 'var(--primary-600)', borderRadius: '4px' }}></div>
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--spacing-xs)' }}>
                  <span>React / Next.js</span>
                  <span className="text-primary font-semibold">90%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gray-200)', borderRadius: '4px' }}>
                  <div style={{ width: '90%', height: '100%', backgroundColor: 'var(--primary-600)', borderRadius: '4px' }}></div>
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--spacing-xs)' }}>
                  <span>Node.js / Express</span>
                  <span className="text-primary font-semibold">85%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gray-200)', borderRadius: '4px' }}>
                  <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--primary-600)', borderRadius: '4px' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex-between" style={{ marginBottom: 'var(--spacing-xs)' }}>
                  <span>UI/UX Design</span>
                  <span className="text-primary font-semibold">80%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gray-200)', borderRadius: '4px' }}>
                  <div style={{ width: '80%', height: '100%', backgroundColor: 'var(--primary-600)', borderRadius: '4px' }}></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Projets en vedette */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-title">
            <h2>Projets en vedette</h2>
            <p>
              Découvrez quelques-uns de mes projets récents qui démontrent mes compétences 
              et ma passion pour le développement web.
            </p>
          </div>
          
          <div className="grid grid-3 gap-lg">
            {featuredProjects.map((project) => (
              <Card key={project.id} hover>
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
                  {project.imageUrl || project.thumbnail ? (
                    <img
                      src={project.imageUrl || project.thumbnail}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--border-radius)' }}
                    />
                  ) : (
                    <span>Pas d'image</span>
                  )}
                </div>
                <h3>{project.title}</h3>
                <p>{project.description || project.shortDescription}</p>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                  <Button variant="outline" size="sm" icon={ExternalLink}>
                    Demo
                  </Button>
                  <Button variant="ghost" size="sm" icon={Github}>
                    Code
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center" style={{ marginTop: 'var(--spacing-2xl)' }}>
            <Link to="/portfolio">
              <Button icon={ArrowRight} iconPosition="right">
                Voir tous les projets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Blog récent */}
      {recentPosts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Derniers articles</h2>
              <p>
                Découvrez mes réflexions et expériences sur le développement web, 
                les technologies modernes et les meilleures pratiques.
              </p>
            </div>
            
            <div className="grid grid-3 gap-lg">
              {recentPosts.map((post) => (
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
                    <p>{post.excerpt || post.shortDescription}</p>
                    <div className="flex-between text-gray-light" style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-md)' }}>
                      <span>{new Date(post.publishedAt || post.publishDate).toLocaleDateString('fr-FR')}</span>
                      <span style={{ 
                        padding: 'var(--spacing-xs) var(--spacing-sm)', 
                        backgroundColor: 'var(--gray-100)', 
                        borderRadius: 'var(--border-radius)' 
                      }}>
                        {post.category || 'Blog'}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="text-center" style={{ marginTop: 'var(--spacing-2xl)' }}>
              <Link to="/blog">
                <Button icon={ArrowRight} iconPosition="right">
                  Voir tous les articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section Contact CTA */}
      <section className="hero">
        <div className="container">
          <h2>Prêt à collaborer ?</h2>
          <p>
            Je suis toujours à la recherche de nouveaux défis et de projets passionnants. 
            N'hésitez pas à me contacter pour discuter de votre projet.
          </p>
          <Link to="/contact">
            <Button variant="secondary" size="lg">
              Me contacter
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

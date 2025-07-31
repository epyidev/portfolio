import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { LogOut, FileText, Briefcase, Settings, Download } from 'lucide-react';
import { Button, Card, LoadingSpinner } from '../components/UI';
import dashboardService, { type DashboardStats } from '../services/dashboardService';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchStats();
    }
  }, [isAuthenticated, loading]);

  const fetchStats = async () => {
    try {
      const dashboardStats = await dashboardService.getStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading || statsLoading) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const dashboardCards = [
    {
      title: 'Projets',
      description: 'Gérer les projets du portfolio',
      icon: Briefcase,
      count: `${stats?.projectsCount || 0} projet${(stats?.projectsCount || 0) > 1 ? 's' : ''}`,
      action: 'Gérer les projets',
      href: '/admin/projects'
    },
    {
      title: 'Articles de blog',
      description: 'Créer et modifier les articles',
      icon: FileText,
      count: `${stats?.blogPostsCount || 0} article${(stats?.blogPostsCount || 0) > 1 ? 's' : ''}`,
      action: 'Gérer le blog',
      href: '/admin/blog'
    },
    {
      title: 'CV',
      description: 'Uploader et gérer le CV téléchargeable',
      icon: Download,
      count: stats?.hasCVFile ? 'PDF disponible' : 'Aucun CV',
      action: 'Gérer le CV',
      href: '/admin/cv'
    },
    {
      title: 'Paramètres',
      description: 'Configuration du site et réseaux sociaux',
      icon: Settings,
      count: 'Site actif',
      action: 'Paramètres',
      href: '/admin/settings'
    }
  ];

  return (
    <div>
      {/* Header Admin */}
      <section className="hero">
        <div className="container">
          <div className="flex-between">
            <div>
              <h1>Panneau d'administration</h1>
              <p>
                Bienvenue, {user?.username || 'Admin'} ! Gérez votre portfolio depuis cette interface.
              </p>
            </div>
            <Button 
              variant="secondary" 
              icon={LogOut} 
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="section">
        <div className="container">
          {/* Statistiques rapides */}
          <div className="grid grid-2 gap-xl" style={{ marginBottom: 'var(--spacing-3xl)' }}>
            {dashboardCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Card key={card.title} hover>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                    <div style={{ 
                      padding: 'var(--spacing-sm)', 
                      backgroundColor: 'var(--primary-100)', 
                      borderRadius: 'var(--border-radius)' 
                    }}>
                      <IconComponent style={{ color: 'var(--primary-600)' }} size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>{card.title}</h3>
                      <p className="text-gray" style={{ marginBottom: 'var(--spacing-sm)' }}>
                        {card.description}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginTop: 'var(--spacing-md)'
                      }}>
                        <span style={{ 
                          fontSize: '0.875rem', 
                          color: 'var(--primary-600)', 
                          fontWeight: '500' 
                        }}>
                          {card.count}
                        </span>
                        <Link to={card.href}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                          >
                            {card.action}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Informations système */}
          <div style={{ marginTop: 'var(--spacing-3xl)' }}>
            <Card>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Informations système</h3>
              <div className="grid grid-3 gap-lg">
                <div>
                  <h4 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: 'var(--gray-500)', 
                    marginBottom: 'var(--spacing-xs)' 
                  }}>
                    Version
                  </h4>
                  <p>Portfolio v1.0.0</p>
                </div>
                <div>
                  <h4 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: 'var(--gray-500)', 
                    marginBottom: 'var(--spacing-xs)' 
                  }}>
                    Dernière connexion
                  </h4>
                  <p>{stats?.lastLoginDate ? new Date(stats.lastLoginDate).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <h4 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: 'var(--gray-500)', 
                    marginBottom: 'var(--spacing-xs)' 
                  }}>
                    Statut
                  </h4>
                  <p style={{ color: 'var(--green-600)' }}>✓ En ligne</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

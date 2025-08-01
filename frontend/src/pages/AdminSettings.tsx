import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input, Textarea, LoadingSpinner } from '../components/UI';
import configService, { type HomePageConfig } from '../services/configService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { SocialNetwork } from '../types';

const AdminSettings: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homePageConfig, setHomePageConfig] = useState<HomePageConfig>({
    greeting: '',
    shortDescription: '',
    contactEmail: '',
    contactPhone: '',
    markdownContent: '',
    updatedAt: ''
  });

  useDocumentTitle('Administration - Paramètres');
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([]);
  const [newSocial, setNewSocial] = useState({
    name: '',
    url: '',
    icon: ''
  });

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
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const config = await configService.getConfig();
      setHomePageConfig(config.homePage);
      setSocialNetworks(config.socialNetworks);
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHomePage = async () => {
    setSaving(true);
    try {
      await configService.updateHomePage(homePageConfig);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
    }
  };

  const handleAddSocialNetwork = async () => {
    if (!newSocial.name || !newSocial.url || !newSocial.icon) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const order = Math.max(...socialNetworks.map(s => s.order), 0) + 1;
      await configService.addSocialNetwork({
        ...newSocial,
        order
      });
      setNewSocial({ name: '', url: '', icon: '' });
      await fetchConfig();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout du réseau social');
    }
  };

  const handleDeleteSocialNetwork = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce réseau social ?')) {
      return;
    }

    try {
      await configService.deleteSocialNetwork(id);
      await fetchConfig();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
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
          <div>
            <Link to="/admin" style={{ 
              display: 'flex', 
              alignItems: 'left', 
              gap: 'var(--spacing-xs)', 
              color: 'var(--text-secondary)', 
              textDecoration: 'none',
              marginBottom: 'var(--spacing-md)'
            }}>
              <ArrowLeft size={16} />
              Retour au dashboard
            </Link>
            <h1>Paramètres du site</h1>
            <p>Configurez la page d'accueil et les réseaux sociaux</p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3xl)' }}>
            
            {/* Configuration page d'accueil */}
            <Card>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2>Page d'accueil</h2>
                <p className="text-gray">Configurez les informations affichées sur la page d'accueil</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <Input
                  label="Message d'accueil"
                  value={homePageConfig.greeting}
                  onChange={(e) => setHomePageConfig((prev: HomePageConfig) => ({ ...prev, greeting: e.target.value }))}
                  placeholder="Bonjour, je suis Pierre Lihoreau..."
                />

                <Textarea
                  label="Description courte"
                  value={homePageConfig.shortDescription}
                  onChange={(e) => setHomePageConfig((prev: HomePageConfig) => ({ ...prev, shortDescription: e.target.value }))}
                  rows={3}
                  placeholder="Développeur passionné spécialisé dans le développement web moderne..."
                />

                <div className="grid grid-2 gap-lg">
                  <Input
                    label="Email de contact"
                    type="email"
                    value={homePageConfig.contactEmail}
                    onChange={(e) => setHomePageConfig((prev: HomePageConfig) => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="contact@example.com"
                  />
                  <Input
                    label="Téléphone de contact"
                    type="tel"
                    value={homePageConfig.contactPhone}
                    onChange={(e) => setHomePageConfig((prev: HomePageConfig) => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <Textarea
                  label="Contenu Markdown"
                  value={homePageConfig.markdownContent}
                  onChange={(e) => setHomePageConfig((prev: HomePageConfig) => ({ ...prev, markdownContent: e.target.value }))}
                  rows={10}
                  placeholder="# À propos de moi&#10;&#10;Écrivez votre présentation en Markdown..."
                />

                <div>
                  <Button
                    variant="primary"
                    icon={Save}
                    onClick={handleSaveHomePage}
                    isLoading={saving}
                  >
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Réseaux sociaux */}
            <Card>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2>Réseaux sociaux</h2>
                <p className="text-gray">Gérez les liens vers vos réseaux sociaux</p>
              </div>

              {/* Liste des réseaux existants */}
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                {socialNetworks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {socialNetworks.map((social) => (
                      <div 
                        key={social.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--spacing-md)',
                          padding: 'var(--spacing-md)',
                          backgroundColor: 'var(--gray-50)',
                          borderRadius: 'var(--border-radius)'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <strong>{social.name}</strong>
                          <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                            {social.url}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={ExternalLink}
                            onClick={() => window.open(social.url, '_blank')}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDeleteSocialNetwork(social.id)}
                            style={{ color: 'var(--red-600)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray">Aucun réseau social configuré</p>
                )}
              </div>

              {/* Ajouter un nouveau réseau */}
              <div style={{ 
                padding: 'var(--spacing-lg)', 
                backgroundColor: 'var(--gray-50)', 
                borderRadius: 'var(--border-radius)' 
              }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Ajouter un réseau social</h3>
                <div className="grid grid-3 gap-md" style={{ marginBottom: 'var(--spacing-md)' }}>
                  <Input
                    label="Nom"
                    value={newSocial.name}
                    onChange={(e) => setNewSocial((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="LinkedIn"
                  />
                  <Input
                    label="URL"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                  />
                  <Input
                    label="Icône"
                    value={newSocial.icon}
                    onChange={(e) => setNewSocial((prev) => ({ ...prev, icon: e.target.value }))}
                    placeholder="linkedin"
                  />
                </div>
                <Button
                  variant="outline"
                  icon={Plus}
                  onClick={handleAddSocialNetwork}
                >
                  Ajouter
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;

import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, ExternalLink, Image, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input, Textarea, LoadingSpinner } from '../components/UI';
import configService, { type HomePageConfig } from '../services/configService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getImageUrl } from '../services/api';
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
  const [portfolioHeroBackground, setPortfolioHeroBackground] = useState<string>('');
  const [uploadingHomeHero, setUploadingHomeHero] = useState(false);
  const [uploadingPortfolioHero, setUploadingPortfolioHero] = useState(false);

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
      setPortfolioHeroBackground(config.portfolioPage?.heroBackgroundImage || '');
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

  const handleUploadHomeHeroBackground = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingHomeHero(true);
    try {
      await configService.uploadHomePageHeroBackground(file);
      await fetchConfig();
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingHomeHero(false);
    }
  };

  const handleUploadPortfolioHeroBackground = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPortfolioHero(true);
    try {
      await configService.uploadPortfolioHeroBackground(file);
      await fetchConfig();
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingPortfolioHero(false);
    }
  };

  const handleRemoveHomeHeroBackground = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer l\'image de fond de la page d\'accueil ?')) {
      return;
    }
    
    try {
      await configService.removeHomePageHeroBackground();
      await fetchConfig();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'image');
    }
  };

  const handleRemovePortfolioHeroBackground = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer l\'image de fond du portfolio ?')) {
      return;
    }
    
    try {
      await configService.removePortfolioHeroBackground();
      await fetchConfig();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'image');
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

            {/* Gestion des images de fond hero */}
            <Card>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2>Images de fond des sections hero</h2>
                <p className="text-gray">Configurez les images de fond affichées dans les sections hero des pages</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                
                {/* Image de fond page d'accueil */}
                <div>
                  <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Page d'accueil</h3>
                  
                  {homePageConfig.heroBackgroundImage ? (
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                      <div style={{ 
                        position: 'relative',
                        width: '300px',
                        height: '150px',
                        borderRadius: 'var(--border-radius)',
                        overflow: 'hidden',
                        border: `var(--border-width) solid var(--border-primary)`
                      }}>
                        <img
                          src={getImageUrl(homePageConfig.heroBackgroundImage)}
                          alt="Image de fond page d'accueil"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          onClick={handleRemoveHomeHeroBackground}
                          style={{
                            position: 'absolute',
                            top: 'var(--spacing-xs)',
                            right: 'var(--spacing-xs)',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition-fast)'
                          }}
                          title="Supprimer l'image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      marginBottom: 'var(--spacing-md)',
                      padding: 'var(--spacing-lg)',
                      border: `2px dashed var(--border-secondary)`,
                      borderRadius: 'var(--border-radius)',
                      textAlign: 'center',
                      color: 'var(--text-muted)'
                    }}>
                      <Image size={48} style={{ marginBottom: 'var(--spacing-sm)' }} />
                      <p>Aucune image de fond configurée</p>
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadHomeHeroBackground}
                      style={{ display: 'none' }}
                      id="home-hero-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('home-hero-upload')?.click()}
                      isLoading={uploadingHomeHero}
                    >
                      {uploadingHomeHero ? 'Upload...' : 'Changer l\'image'}
                    </Button>
                  </div>
                </div>

                {/* Image de fond portfolio */}
                <div>
                  <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Page Portfolio</h3>
                  
                  {portfolioHeroBackground ? (
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                      <div style={{ 
                        position: 'relative',
                        width: '300px',
                        height: '150px',
                        borderRadius: 'var(--border-radius)',
                        overflow: 'hidden',
                        border: `var(--border-width) solid var(--border-primary)`
                      }}>
                        <img
                          src={getImageUrl(portfolioHeroBackground)}
                          alt="Image de fond portfolio"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          onClick={handleRemovePortfolioHeroBackground}
                          style={{
                            position: 'absolute',
                            top: 'var(--spacing-xs)',
                            right: 'var(--spacing-xs)',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition-fast)'
                          }}
                          title="Supprimer l'image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      marginBottom: 'var(--spacing-md)',
                      padding: 'var(--spacing-lg)',
                      border: `2px dashed var(--border-secondary)`,
                      borderRadius: 'var(--border-radius)',
                      textAlign: 'center',
                      color: 'var(--text-muted)'
                    }}>
                      <Image size={48} style={{ marginBottom: 'var(--spacing-sm)' }} />
                      <p>Aucune image de fond configurée</p>
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadPortfolioHeroBackground}
                      style={{ display: 'none' }}
                      id="portfolio-hero-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('portfolio-hero-upload')?.click()}
                      isLoading={uploadingPortfolioHero}
                    >
                      {uploadingPortfolioHero ? 'Upload...' : 'Changer l\'image'}
                    </Button>
                  </div>
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

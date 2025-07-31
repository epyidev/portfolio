import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, FileText, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input, LoadingSpinner } from '../components/UI';
import configService from '../services/configService';

const AdminCV: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [hasCV, setHasCV] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  useEffect(() => {
    checkCVStatus();
  }, []);

  const checkCVStatus = async () => {
    try {
      // Tentative de téléchargement pour vérifier si un CV existe
      const response = await fetch(configService.getDownloadCVUrl(), {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setHasCV(response.ok);
      if (response.ok) {
        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) {
            setFileName(match[1]);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du CV:', error);
      setHasCV(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (file.type !== 'application/pdf') {
      alert('Veuillez sélectionner un fichier PDF');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    try {
      await configService.uploadFile(file);
      setUploadMessage('CV uploadé avec succès !');
      setFileName(file.name);
      setHasCV(true);
      
      // Effacer le message après 3 secondes
      setTimeout(() => setUploadMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload du CV');
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleDownload = () => {
    window.open(configService.getDownloadCVUrl(), '_blank');
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer le CV ?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/cv', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setHasCV(false);
        setFileName('');
        alert('CV supprimé avec succès');
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du CV');
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
            <h1>Gestion du CV</h1>
            <p>Uploadez et gérez votre CV au format PDF</p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            
            {/* Message de succès */}
            {uploadMessage && (
              <div style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--green-100)',
                color: 'var(--green-800)',
                borderRadius: 'var(--border-radius)',
                marginBottom: 'var(--spacing-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}>
                <Check size={16} />
                {uploadMessage}
              </div>
            )}

            {/* État actuel du CV */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <Card>
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h2>CV actuel</h2>
                  <p className="text-gray">Statut de votre CV téléchargeable</p>
                </div>

                {hasCV ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--green-50)',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--green-200)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--green-100)',
                        borderRadius: 'var(--border-radius)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={20} style={{ color: 'var(--green-600)' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '500' }}>
                          {fileName || 'CV.pdf'}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--green-600)' }}>
                          CV disponible au téléchargement
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Download}
                        onClick={handleDownload}
                      >
                        Télécharger
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={handleDelete}
                        style={{ color: 'var(--red-600)' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: 'var(--spacing-xl)',
                    textAlign: 'center',
                    backgroundColor: 'var(--gray-50)',
                    borderRadius: 'var(--border-radius)',
                    border: '2px dashed var(--gray-300)'
                  }}>
                    <FileText size={48} style={{ color: 'var(--gray-400)', marginBottom: 'var(--spacing-md)' }} />
                    <h3 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>Aucun CV uploadé</h3>
                    <p className="text-gray" style={{ margin: 0 }}>
                      Uploadez votre CV pour le rendre téléchargeable par les visiteurs
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Upload de nouveau CV */}
            <Card>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2>{hasCV ? 'Remplacer le CV' : 'Uploader un CV'}</h2>
                <p className="text-gray">
                  {hasCV 
                    ? 'Sélectionnez un nouveau fichier PDF pour remplacer le CV actuel'
                    : 'Sélectionnez un fichier PDF (max 5MB)'
                  }
                </p>
              </div>

              <div>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                
                {uploading && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    color: 'var(--primary-600)',
                    marginTop: 'var(--spacing-md)'
                  }}>
                    <LoadingSpinner size="sm" />
                    Upload en cours...
                  </div>
                )}

                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--gray-600)',
                  marginTop: 'var(--spacing-md)'
                }}>
                  <ul style={{ margin: 0, paddingLeft: 'var(--spacing-lg)' }}>
                    <li>Format accepté : PDF uniquement</li>
                    <li>Taille maximale : 5MB</li>
                    <li>Le fichier remplacera automatiquement le CV existant</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminCV;

import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Card, Input } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const AdminLoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useDocumentTitle('Administration - Connexion');

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Section Hero */}
      <section className="hero">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: 'var(--primary-600)', 
              borderRadius: 'var(--border-radius)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Lock style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
          </div>
          <h1>Administration</h1>
          <p>Connectez-vous pour accéder au panneau d'administration</p>
        </div>
      </section>

      {/* Section Connexion */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <Card>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                {error && (
                  <div style={{ 
                    backgroundColor: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    borderRadius: 'var(--border-radius)', 
                    padding: 'var(--spacing-md)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ flexShrink: 0 }}>
                        <svg style={{ height: '20px', width: '20px', color: '#f87171' }} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div style={{ marginLeft: 'var(--spacing-sm)' }}>
                        <p style={{ fontSize: '0.875rem', color: '#991b1b' }}>{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Input
                  label="Nom d'utilisateur"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Entrez votre nom d'utilisateur"
                />

                <div style={{ position: 'relative' }}>
                  <Input
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Entrez votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '36px', 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--gray-400)', 
                      cursor: 'pointer' 
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  style={{ width: '100%' }}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                    Accès réservé aux administrateurs
                  </p>
                </div>

                {/* Information de développement */}
                {process.env.NODE_ENV === 'development' && (
                  <div style={{ 
                    padding: 'var(--spacing-md)', 
                    backgroundColor: '#eff6ff', 
                    border: '1px solid #bfdbfe',
                    borderRadius: 'var(--border-radius)' 
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#1e40af', 
                        marginBottom: 'var(--spacing-sm)' 
                      }}>
                        Mode Développement
                      </h3>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        color: '#2563eb', 
                        marginBottom: 'var(--spacing-sm)' 
                      }}>
                        Identifiants par défaut :
                      </p>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#2563eb', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 'var(--spacing-xs)' 
                      }}>
                        <div><strong>Utilisateur :</strong> admin</div>
                        <div><strong>Mot de passe :</strong> admin123</div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLoginPage;

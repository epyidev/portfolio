import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button, Card, Input } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';

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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--gray-50)', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      padding: 'var(--spacing-3xl) var(--spacing-lg)' 
    }}>
      <div style={{ margin: '0 auto', width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            backgroundColor: 'var(--primary-600)', 
            borderRadius: 'var(--border-radius)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Lock style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
        </div>
        <h2 style={{ 
          marginTop: 'var(--spacing-xl)', 
          textAlign: 'center', 
          fontSize: '2rem', 
          fontWeight: 'bold' 
        }}>
          Administration
        </h2>
        <p style={{ 
          marginTop: 'var(--spacing-sm)', 
          textAlign: 'center', 
          fontSize: '0.875rem', 
          color: 'var(--gray-600)' 
        }}>
          Connectez-vous pour accéder au panneau d'administration
        </p>
      </div>

      <div style={{ marginTop: 'var(--spacing-2xl)', margin: '0 auto', width: '100%', maxWidth: '400px' }}>
        <Card>
          <div style={{ padding: 'var(--spacing-2xl) var(--spacing-xl)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
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

              <div style={{ position: 'relative' }}>
                <Input
                  label="Nom d'utilisateur"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Entrez votre nom d'utilisateur"
                />
                <User 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '36px', 
                    color: 'var(--gray-400)' 
                  }} 
                  size={20} 
                />
              </div>

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
                <Lock 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '36px', 
                    color: 'var(--gray-400)' 
                  }} 
                  size={20} 
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
            </form>

            <div style={{ marginTop: 'var(--spacing-xl)' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  Accès réservé aux administrateurs
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Information de développement */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <Card>
              <div style={{ 
                padding: 'var(--spacing-md)', 
                backgroundColor: '#eff6ff', 
                border: '1px solid #bfdbfe' 
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
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'var(--spacing-2xl)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
          © {new Date().getFullYear()} Mon Portfolio. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;

import React, { useState, useEffect } from 'react';
import { Download, Mail, Phone } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Config } from '../types';
import { configService } from '../services/configService';

const HomePage: React.FC = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await configService.getConfig();
        setConfig(configData);
      } catch (err) {
        setError('Erreur lors du chargement de la configuration');
        console.error('Error fetching config:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleDownloadCV = () => {
    window.open(configService.getDownloadCVUrl(), '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
          <p className="text-gray-600">{error || 'Configuration non trouvée'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {config.homePage.greeting}
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={handleDownloadCV}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Télécharger mon CV</span>
              </button>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-600 mb-12">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>{config.homePage.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>{config.homePage.contactPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="markdown-content">
            <ReactMarkdown>
              {config.homePage.markdownContent}
            </ReactMarkdown>
          </div>
        </div>
      </section>

      {/* Social Networks */}
      {config.socialNetworks.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Retrouvez-moi sur</h2>
              <div className="flex justify-center space-x-6">
                {config.socialNetworks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <span className="sr-only">{social.name}</span>
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {social.name.charAt(0).toUpperCase()}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

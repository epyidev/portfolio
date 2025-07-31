import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Powered by */}
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              Powered by{' '}
              <a
                href="https://lets-pop.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 inline-flex items-center"
              >
                Let's PopP !
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          </div>

          {/* Social Networks - sera rempli dynamiquement */}
          <div className="flex space-x-4">
            {/* Les réseaux sociaux seront ajoutés via le contexte */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react';
import { Button, Card, Input, Textarea } from '../components/UI';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulation d'envoi de formulaire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici, vous pourriez envoyer les données vers votre API
      console.log('Données du formulaire:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@monportfolio.com',
      link: 'mailto:contact@monportfolio.com',
      description: 'Réponse sous 24h',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+33 1 23 45 67 89',
      link: 'tel:+33123456789',
      description: 'Lun-Ven 9h-18h',
    },
    {
      icon: MapPin,
      title: 'Localisation',
      value: 'Paris, France',
      link: '#',
      description: 'Disponible en remote',
    },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com',
      color: 'hover:text-gray-900',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com',
      color: 'hover:text-blue-600',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com',
      color: 'hover:text-blue-400',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Contactez-moi</h1>
          <p>
            Une idée de projet ? Une question ? N'hésitez pas à me contacter. 
            Je serais ravi de discuter avec vous !
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
        <div className="grid grid-3 gap-xl">
          {/* Informations de contact */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 'var(--spacing-xl)' }}>
                  Restons en contact
                </h2>
                <p className="text-gray" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                  Je suis toujours ouvert aux nouvelles opportunités et aux projets passionnants. 
                  Que ce soit pour un projet web, une collaboration ou simplement pour échanger, 
                  n'hésitez pas à me contacter.
                </p>
              </div>

              {/* Méthodes de contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                {contactMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={method.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ 
                          width: '48px', 
                          height: '48px', 
                          backgroundColor: 'var(--primary-100)', 
                          borderRadius: 'var(--border-radius)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <IconComponent style={{ width: '24px', height: '24px', color: 'var(--primary-600)' }} />
                        </div>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: 'var(--spacing-xs)' }}>{method.title}</h3>
                        <a
                          href={method.link}
                          style={{ 
                            color: 'var(--primary-600)', 
                            fontWeight: '500', 
                            textDecoration: 'none',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-700)'}
                          onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary-600)'}
                        >
                          {method.value}
                        </a>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: 'var(--spacing-xs)' }}>{method.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Réseaux sociaux */}
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: 'var(--spacing-md)' }}>Suivez-moi</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          backgroundColor: 'var(--gray-100)', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'var(--gray-600)', 
                          transition: 'all 0.2s ease',
                          textDecoration: 'none'
                        }}
                        aria-label={social.name}
                      >
                        <IconComponent size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div style={{ gridColumn: 'span 2' }}>
            <Card>
              <div style={{ padding: 'var(--spacing-2xl)' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 'var(--spacing-xl)' }}>
                  Envoyez-moi un message
                </h2>

                {submitStatus === 'success' && (
                  <div style={{ 
                    marginBottom: 'var(--spacing-xl)', 
                    padding: 'var(--spacing-md)', 
                    backgroundColor: '#f0fdf4', 
                    border: '1px solid #bbf7d0', 
                    borderRadius: 'var(--border-radius)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ flexShrink: 0 }}>
                        <svg style={{ height: '20px', width: '20px', color: '#4ade80' }} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div style={{ marginLeft: 'var(--spacing-sm)' }}>
                        <p style={{ color: '#166534' }}>
                          Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div style={{ 
                    marginBottom: 'var(--spacing-xl)', 
                    padding: 'var(--spacing-md)', 
                    backgroundColor: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    borderRadius: 'var(--border-radius)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ flexShrink: 0 }}>
                        <svg style={{ height: '20px', width: '20px', color: '#f87171' }} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div style={{ marginLeft: 'var(--spacing-sm)' }}>
                        <p style={{ color: '#991b1b' }}>
                          Une erreur s'est produite lors de l'envoi. Veuillez réessayer ou me contacter directement par email.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                  <div className="grid grid-2 gap-xl">
                    <Input
                      label="Nom complet"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Votre nom"
                    />
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>

                  <Input
                    label="Sujet"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="De quoi souhaitez-vous parler ?"
                  />

                  <Textarea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Décrivez votre projet, vos besoins ou posez-moi vos questions..."
                  />

                  <Button
                    type="submit"
                    size="lg"
                    icon={Send}
                    isLoading={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Section FAQ */}
      <section className="section section-white">
        <div className="container" style={{ maxWidth: '1024px' }}>
          <div className="section-title">
            <h2>Questions fréquentes</h2>
            <p>
              Voici les réponses aux questions les plus courantes.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: 'var(--spacing-sm)' }}>
                Quels types de projets acceptez-vous ?
              </h3>
              <p className="text-gray">
                Je travaille principalement sur des applications web modernes utilisant React, TypeScript, 
                et Node.js. J'accepte aussi bien les projets de développement complet que les missions 
                de développement frontend ou backend spécifiques.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: 'var(--spacing-sm)' }}>
                Quels sont vos tarifs ?
              </h3>
              <p className="text-gray">
                Mes tarifs varient selon la complexité et la durée du projet. Je propose des tarifs 
                journaliers pour les missions longues et des forfaits pour les projets avec un scope défini. 
                N'hésitez pas à me contacter pour un devis personnalisé.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: 'var(--spacing-sm)' }}>
                Travaillez-vous en remote ?
              </h3>
              <p className="text-gray">
                Oui, je travaille principalement en remote mais je peux également me déplacer pour des 
                réunions importantes ou des phases de projet spécifiques. Je suis basé à Paris mais 
                ouvert aux collaborations dans toute la France.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: 'var(--spacing-sm)' }}>
                Quel est votre délai de réponse ?
              </h3>
              <p className="text-gray">
                Je réponds généralement aux demandes de contact sous 24h en semaine. Pour les projets 
                urgents, n'hésitez pas à me contacter directement par téléphone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

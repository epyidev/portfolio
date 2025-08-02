import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  structuredData?: any;
}

export const useSEO = (seoData: SEOData) => {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}${location.pathname}`;

    // Title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Description
    updateMetaTag('description', seoData.description || 'Portfolio de Pierre Lihoreau - Expert Audiovisuel & Développeur Full-Stack. Découvrez mes réalisations en production audiovisuelle, UI/UX et développement web.');

    // Keywords
    updateMetaTag('keywords', seoData.keywords || 'Pierre Lihoreau, Portfolio, Audiovisuel, Production Vidéo, Expert Audiovisuel, Développeur Full-Stack, UI/UX, React, TypeScript, Node.js');

    // Language
    document.documentElement.setAttribute('lang', 'fr');

    // Canonical URL
    updateLinkTag('canonical', seoData.canonical || currentUrl);

    // Open Graph
    updateMetaProperty('og:title', seoData.ogTitle || seoData.title || document.title);
    updateMetaProperty('og:description', seoData.ogDescription || seoData.description || 'Portfolio de Pierre Lihoreau - Expert Audiovisuel & Développeur Full-Stack');
    updateMetaProperty('og:image', seoData.ogImage || `${baseUrl}/favicon-96x96.png`);
    updateMetaProperty('og:url', currentUrl);
    updateMetaProperty('og:type', seoData.ogType || 'website');
    updateMetaProperty('og:site_name', 'Pierre Lihoreau - Portfolio');
    updateMetaProperty('og:locale', 'fr_FR');

    // Twitter Card
    updateMetaName('twitter:card', seoData.twitterCard || 'summary_large_image');
    updateMetaName('twitter:title', seoData.twitterTitle || seoData.ogTitle || seoData.title || document.title);
    updateMetaName('twitter:description', seoData.twitterDescription || seoData.ogDescription || seoData.description || 'Portfolio de Pierre Lihoreau - Expert Audiovisuel & Développeur Full-Stack');
    updateMetaName('twitter:image', seoData.twitterImage || seoData.ogImage || `${baseUrl}/favicon-96x96.png`);

    // Structured Data (JSON-LD)
    if (seoData.structuredData) {
      updateStructuredData(seoData.structuredData);
    }

  }, [seoData, location.pathname]);
};

// Utility functions
const updateMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.content = content;
};

const updateMetaName = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
};

const updateStructuredData = (data: any) => {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

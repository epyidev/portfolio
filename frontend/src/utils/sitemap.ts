import { useEffect } from 'react';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (projects: any[] = []): string => {
  const baseUrl = 'https://pierrelihoreau.lets-pop.fr';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}/portfolio`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    }
  ];

  const projectPages: SitemapEntry[] = projects.map(project => ({
    url: `${baseUrl}/portfolio/${project.id}`,
    lastmod: project.updatedAt ? project.updatedAt.split('T')[0] : currentDate,
    changefreq: 'monthly' as const,
    priority: 0.7
  }));

  const allPages = [...staticPages, ...projectPages];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

export const useSitemapGeneration = () => {
  useEffect(() => {
    // Cette fonction pourrait être appelée côté serveur
    // pour générer dynamiquement le sitemap
  }, []);
};

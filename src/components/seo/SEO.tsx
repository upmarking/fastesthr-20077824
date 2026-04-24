import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  article?: boolean;
  author?: string;
  date?: string;
  category?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'software';
  breadcrumbs?: Array<{ name: string; path: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}

/**
 * SEO Component to manage all page metadata, Open Graph, Twitter cards, and JSON-LD structured data.
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  article,
  author = 'FastestHR Team',
  date,
  category,
  canonical,
  type = 'website',
  breadcrumbs,
  faqs
}) => {
  const siteName = 'FastestHR';
  const siteUrl = 'https://fastesthr.com';
  const defaultTitle = 'FastestHR | Next-Gen Workforce OS';
  const defaultDescription = 'The fastest, most intelligent workforce management platform for modern enterprises. Streamline HR, payroll, and recruitment with precision.';
  const defaultImage = 'https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/59918d24-608b-4e3b-afcb-a133efbc4225/id-preview-ee149eb3--1f9ce50f-8d24-479b-acd8-e535221e7f10.lovable.app-1773472312491.png';
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl);

  const seo = {
    title: title ? `${title} | ${siteName}` : defaultTitle,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: currentUrl,
  };

  // Structured Data (JSON-LD)
  const schemaOrgJSONLD: any[] = [
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      "name": siteName,
      "url": siteUrl,
      "logo": defaultImage,
      "sameAs": [
        "https://twitter.com/FastestHR",
        "https://linkedin.com/company/fastesthr"
      ]
    },
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      "url": siteUrl,
      "name": siteName,
      "alternateName": ["FastestHR OS", "Fast HRMS", "Fastest HR"]
    }
  ];

  // FAQ Schema
  if (faqs && faqs.length > 0) {
    schemaOrgJSONLD.push({
      "@context": "http://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  }

  // Breadcrumbs Schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemaOrgJSONLD.push({
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.path.startsWith('http') ? crumb.path : `${siteUrl}${crumb.path}`
      }))
    });
  }

  if (type === 'article' || article) {
    schemaOrgJSONLD.push({
      "@context": "http://schema.org",
      "@type": "BlogPosting",
      "url": seo.url,
      "name": seo.title,
      "headline": seo.title,
      "image": {
        "@type": "ImageObject",
        "url": seo.image
      },
      "description": seo.description,
      "author": {
        "@type": "Person",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "logo": {
          "@type": "ImageObject",
          "url": defaultImage
        }
      },
      "datePublished": date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": siteUrl
      }
    });
  } else if (type === 'software') {
    schemaOrgJSONLD.push({
      "@context": "http://schema.org",
      "@type": "SoftwareApplication",
      "name": siteName,
      "operatingSystem": "Web-based, Cloud, SaaS",
      "applicationCategory": "BusinessApplication, HRSoftware, HRMS",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1250"
      }
    });
  }

  return (
    <Helmet>
      {/* Standard identity tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="image" content={seo.image} />
      <link rel="canonical" href={seo.url} />

      {/* Open Graph / Facebook */}
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:site" content="@Lovable" />
      <meta name="twitter:creator" content="@Lovable" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </Helmet>
  );
};

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  name?: string;
  href?: string;
  keywords?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export function SEO({ 
  title, 
  description, 
  type = "website", 
  name = "SSC Tutor AI", 
  href = "",
  keywords,
  jsonLd
}: SEOProps) {
  const url = `https://ssc-tutor-ai.vercel.app${href}`;
  
  const defaultKeywords = "SSC Tutor AI, SSC AI Tutor, SSC Bangladesh, SSC Learning Platform, SSC Study Platform, SSC Preparation, SSC Board Exam, SSC Guide, SSC Notes, SSC Model Test, SSC Practice, SSC MCQ, SSC Creative Questions, SSC Chapter Wise Notes, SSC Question Bank, SSC Online Tutor, SSC Education Bangladesh, SSC AI Learning, SSC Study Assistant, Free SSC Learning, NCTB SSC, এসএসসি, এসএসসি প্রস্তুতি, এসএসসি গাইড, এসএসসি নোট, এসএসসি সাজেশন, এসএসসি প্রশ্ন ব্যাংক, এসএসসি মডেল টেস্ট, এসএসসি অনুশীলন, NCTB, বাংলাদেশ শিক্ষা";
  
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content="https://ssc-tutor-ai.vercel.app/og-image.jpg" /> 
      
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://ssc-tutor-ai.vercel.app/og-image.jpg" />
      <meta name="twitter:creator" content="@SSCTutorAI" />
      <meta name="twitter:site" content="@SSCTutorAI" />

      {/* Robots meta */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

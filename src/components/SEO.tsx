import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  name?: string;
  href?: string;
  keywords?: string;
  image?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export function SEO({ 
  title, 
  description, 
  type = "website", 
  name = "SSC Tutor AI", 
  href = "",
  keywords,
  image = "https://ssc-tutor-ai.vercel.app/og-image.jpg",
  jsonLd
}: SEOProps) {
  const url = `https://ssc-tutor-ai.vercel.app${href}`;
  
  const highIntentKeywords = [
    "এসএসসি ২০২৫",
    "এসএসসি পরীক্ষা ২০২৫",
    "এসএসসি টেস্ট পেপার ২০২৫",
    "এসএসসি সাজেশন ২০২৫",
    "এসএসসি সুপার সাজেশন",
    "বিগত ৭ বছরের বোর্ড প্রশ্ন",
    "এসএসসি প্রশ্ন ব্যাংক ২০২৪",
    "এসএসসি গণিত টেস্ট পেপার",
    "এসএসসি পদার্থবিজ্ঞান সৃজনশীল সমাধান",
    "এসএসসি রসায়ন বহুনির্বাচনি",
    "ঢাকা বোর্ড এসএসসি প্রশ্ন",
    "চট্টগ্রাম বোর্ড এসএসসি প্রশ্ন",
    "রাজশাহী বোর্ড টেস্ট পেপার",
    "NCTB SSC Suggestion 2025",
    "SSC Test Paper PDF download",
    "SSC 2025 Suggestion PDF",
    "SSC Board Question Solution 2018-2024",
    "SSC Model Test Free",
    "SSC AI Tutor Bangladesh",
    "10 Minute School Free Alternative",
    "Shikho Free Alternative",
    "SSC Physics Notes Bangla",
    "SSC Math Solution PDF",
    "SSC Creative Question Suggestion",
    "মাধ্যমিক শিক্ষা বোর্ড টেস্ট পেপার",
    "SSC Exam Routine 2025"
  ].join(", ");

  // Default Structured Schema for Bangladesh Educational Organization & Website Searchbox
  const baseSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "SSC Tutor AI",
      "alternateName": "মাধ্যমিক শিক্ষা এআই টিউটর",
      "url": "https://ssc-tutor-ai.vercel.app",
      "logo": "https://ssc-tutor-ai.vercel.app/favicon.svg",
      "description": "বাংলাদেশের ১০টি শিক্ষা বোর্ডের বিগত ৭ বছরের আসল বোর্ড প্রশ্নব্যাংক, অফিশিয়াল টেস্ট পেপার, এআই শিক্ষক ও পূর্ণাঙ্গ এসএসসি সাজেশন প্ল্যাটফর্ম।",
      "areaServed": {
        "@type": "Country",
        "name": "Bangladesh"
      },
      "educationalCredentialAwarded": "SSC (Secondary School Certificate)",
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "student",
        "audienceType": "SSC Candidates, Grade 9 and 10 Students"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SSC Tutor AI",
      "url": "https://ssc-tutor-ai.vercel.app",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://ssc-tutor-ai.vercel.app/subjects?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ];

  // Combine schemas
  let structuredData: any[] = [...baseSchemas];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      structuredData = [...structuredData, ...jsonLd];
    } else {
      structuredData.push(jsonLd);
    }
  }
  
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords ? `${keywords}, ${highIntentKeywords}` : highIntentKeywords} />
      
      {/* Geo Location tags for Bangladesh Rankings */}
      <meta name="geo.region" content="BD" />
      <meta name="geo.placename" content="Dhaka, Bangladesh" />
      <meta name="geo.position" content="23.8103;90.4125" />
      <meta name="ICBM" content="23.8103, 90.4125" />

      {/* Language & Direction */}
      <meta httpEquiv="content-language" content="bn, en" />

      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="SSC Tutor AI — এসএসসি টেস্ট পেপার ও প্রশ্নব্যাংক" />
      <meta property="og:locale" content="bn_BD" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@SSCTutorAI" />
      <meta name="twitter:site" content="@SSCTutorAI" />

      {/* Robots meta */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* JSON-LD Structured Data */}
      {structuredData.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

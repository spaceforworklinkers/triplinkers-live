import Link from "next/link";
import Script from "next/script";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

/* ---------------- SEO METADATA ---------------- */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: blog } = await supabase
    .from("blogs")
    .select(`
      title,
      excerpt,
      featured_image,
      seo_title,
      seo_description,
      seo_keywords
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!blog) return {};

  const metaTitle = blog.seo_title || `${blog.title} | TripLinkers`;
  const metaDescription = blog.seo_description || blog.excerpt;
  const canonicalUrl = `https://triplinkers.com/blogs/${slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: blog.seo_keywords || undefined,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      images: blog.featured_image ? [blog.featured_image] : [],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: blog.featured_image ? [blog.featured_image] : [],
    },
  };
}

/* ---------------- BLOG PAGE ---------------- */
export default async function BlogDetailPage({ params }) {
  const { slug } = await params;

  const { data: blog } = await supabase
    .from("blogs")
    .select(`
      *,
      blog_categories (
        categories (
          name,
          slug
        )
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!blog) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Blog not found</h2>
      </div>
    );
  }

  const firstCategory = blog.blog_categories?.[0]?.categories;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.seo_title || blog.title,
    description: blog.seo_description || blog.excerpt,
    image: blog.featured_image ? [blog.featured_image] : undefined,
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      "@type": "Organization",
      name: "TripLinkers Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "TripLinkers",
      logo: {
        "@type": "ImageObject",
        url: "https://triplinkers.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://triplinkers.com/blogs/${blog.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <div className="max-w-4xl mx-auto p-6">
        {blog.featured_image && (
          <img
            src={blog.featured_image}
            alt={blog.seo_title || blog.title}
            className="w-full h-72 object-cover rounded-xl mb-6"
          />
        )}

        {firstCategory && (
          <Link
            href={`/blogs/category/${firstCategory.slug}`}
            className="text-orange-600 font-semibold block mb-2"
          >
            {firstCategory.name}
          </Link>
        )}

        <h1 className="text-4xl font-bold mb-3">{blog.title}</h1>

        <p className="text-sm text-gray-500 mb-8">
          TripLinkers Editorial Team •{" "}
          {new Date(blog.published_at || blog.created_at).toLocaleDateString()}
        </p>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}

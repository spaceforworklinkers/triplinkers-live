import Link from "next/link";
import Script from "next/script";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white flex items-center justify-center p-10">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Blog not found</h2>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Blogs
          </Link>
        </div>
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blogs
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Category Badge */}
        {firstCategory && (
          <Link
            href={`/blogs/category/${firstCategory.slug}`}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-200 transition mb-6"
          >
            <Tag className="w-4 h-4" />
            {firstCategory.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-8 mb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-orange-600" />
            <span className="font-medium">TripLinkers Editorial Team</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <time dateTime={blog.published_at || blog.created_at}>
              {formatDate(blog.published_at || blog.created_at)}
            </time>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featured_image && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={blog.featured_image}
              alt={blog.seo_title || blog.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Blog Content */}
        <div
          className="prose prose-lg prose-orange max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8
            prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-orange-600 prose-a:no-underline prose-a:font-semibold hover:prose-a:text-orange-700
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-gray-700 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-orange-50 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:rounded-r-lg
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-orange-600 prose-code:font-mono prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:my-8 prose-pre:shadow-lg
            prose-table:my-8 prose-table:border-collapse
            prose-thead:bg-orange-100
            prose-th:border prose-th:border-gray-300 prose-th:p-3 prose-th:font-bold prose-th:text-left
            prose-td:border prose-td:border-gray-300 prose-td:p-3
            prose-hr:border-gray-200 prose-hr:my-8"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {/* Call to Action Footer */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Loved this story?
          </h3>
          <p className="text-xl text-orange-100 mb-8">
            Discover more travel inspiration and guides on our blog.
          </p>
          <Link
            href="/blogs"
            className="inline-block bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg"
          >
            Explore More Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
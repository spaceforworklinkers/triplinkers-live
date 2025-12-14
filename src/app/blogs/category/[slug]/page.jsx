import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return {
    title: `${slug.toUpperCase()} Blogs | TripLinkers`,
    description: `Travel blogs related to ${slug} by TripLinkers.`,
  };
}

export default async function CategoryBlogsPage({ params }) {
  const { slug } = await params;

  // 1️⃣ Get category
  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!category) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Category not found</h2>
      </div>
    );
  }

  // 2️⃣ Get only PUBLISHED blogs for this category
  const { data } = await supabase
    .from("blog_categories")
    .select(`
      blogs (
        id,
        title,
        slug,
        featured_image,
        excerpt,
        published_at,
        status
      )
    `)
    .eq("category_id", category.id)
    .eq("blogs.status", "published");

  const blogs = data?.map((row) => row.blogs).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {category.name} Blogs
        </h1>

        {blogs.length === 0 && (
          <p className="text-gray-500">
            No published blogs in this category yet.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl border overflow-hidden"
            >
              {blog.featured_image && (
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold mb-3">
                  {blog.title}
                </h2>

                <p className="text-gray-600 mb-4">
                  {blog.excerpt?.slice(0, 120)}...
                </p>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-orange-600 font-semibold"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

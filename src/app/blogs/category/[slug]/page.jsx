import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

export default async function CategoryBlogsPage({ params }) {
  const { slug } = params;

  // Fetch the category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Category not found</h2>
      </div>
    );
  }

  // Fetch blogs for this category
  const { data: blogs } = await supabase
    .from("blogs")
    .select("id, title, slug, banner_url, description, created_at")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Category Title */}
        <h1 className="text-4xl font-bold mb-8">
          {category.title} Blogs
        </h1>

        {blogs?.length === 0 && (
          <p className="text-gray-500">No blogs available in this category.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs?.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden"
            >
              {blog.banner_url && (
                <img
                  src={blog.banner_url}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold mb-3">{blog.title}</h2>

                <p className="text-gray-600 mb-4">
                  {blog.description?.slice(0, 120)}...
                </p>

                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-orange-600 font-semibold hover:underline"
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

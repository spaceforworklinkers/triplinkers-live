export async function generateMetadata({ params }) {
  const { slug } = params;

  const { data: blog } = await supabase
    .from("blogs")
    .select("title, description, banner_url")
    .eq("slug", slug)
    .single();

  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [blog.banner_url],
      type: "article",
    },
  };
}

import { supabase } from "@/lib/supabaseClient";
export const revalidate = 60;

export default async function BlogDetailPage({ params }) {
  const { slug } = params;

  // Fetch the blog by slug
  const { data: blog } = await supabase
    .from("blogs")
    .select("*, categories(title, slug)")

    .eq("slug", slug)
    .single();

  if (!blog) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Blog not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto p-6">
        {/* Banner */}
        {blog.banner_url && (
          <img
            src={blog.banner_url}
            alt={blog.title}
            className="w-full h-72 object-cover rounded-xl mb-6 shadow"
          />
        )}

        {/* Category */}
        <Link
          href={`/blogs/category/${blog.categories?.slug}`}
          className="text-orange-600 font-semibold mb-2 hover:underline"
        >
          {blog.categories?.title}
        </Link>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

        {/* Date */}
        <p className="text-gray-500 text-sm mb-8">
          Published on {new Date(blog.created_at).toLocaleDateString()}
        </p>

        {/* Content */}
        <div
          className="prose max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>
      </div>
    </div>
  );
}

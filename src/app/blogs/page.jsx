import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

export default async function BlogsPage({ searchParams }) {
  const page = Number(searchParams.page || 1);
  const limit = 6;
  const offset = (page - 1) * limit;

  const search = searchParams.search || "";

  let query = supabase
    .from("blogs")
    .select(
      "id, title, slug, banner_url, description, categories(title, slug), created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  // Apply search if user typed something
  if (search) {
    query = query.textSearch("title", search, { type: "websearch" });
  }

  const { data: blogs, count } = await query.range(offset, offset + limit - 1);

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">Our Blogs</h1>

        {/* Search Bar */}
        <form className="mb-8 flex gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search blogs..."
            defaultValue={search}
            className="w-64 border px-4 py-2 rounded-lg"
          />

          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg">
            Search
          </button>
        </form>

        {/* Blog Grid */}
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

                {/* Clickable category */}
                <Link
                  href={`/blogs/category/${blog.categories?.slug}`}
                  className="text-sm text-orange-600 font-semibold mb-2 hover:underline"
                >
                  {blog.categories?.title}
                </Link>

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

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/blogs?page=${p}${search ? `&search=${search}` : ""}`}
              className={`px-4 py-2 rounded-lg border ${
                p === page
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

export const metadata = {
  title: "Blogs | TripLinkers",
  description:
    "Latest travel blogs, guides, itineraries and destination insights by TripLinkers.",
};

export default async function BlogsPage({ searchParams }) {
  const params = await searchParams;

  const page = Number(params.page || 1);
  const search = params.search || "";
  const categorySlug = params.category || null;

  const limit = 6;
  const offset = (page - 1) * limit;

  /* ---------------- FETCH ONLY CATEGORIES WITH BLOGS ---------------- */
  const { data: categories } = await supabase
    .from("categories")
    .select(
      `
      name,
      slug,
      blog_categories!inner (
        blogs!inner (
          id
        )
      )
      `
    )
    .order("name");

  /* ---------------- BLOG QUERY ---------------- */
  let query = supabase
    .from("blogs")
    .select(
      `
      id,
      title,
      slug,
      featured_image,
      excerpt,
      created_at,
      published_at,
      blog_categories!inner (
        categories!inner (
          name,
          slug
        )
      )
      `,
      { count: "exact" }
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // 🔍 Search
  if (search) {
    query = query.textSearch("title", search, { type: "websearch" });
  }

  // 🏷 Category filter (REAL FIX)
  if (categorySlug) {
    query = query.eq(
      "blog_categories.categories.slug",
      categorySlug
    );
  }

  const { data: blogs, count } = await query.range(
    offset,
    offset + limit - 1
  );

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">Our Blogs</h1>

        {/* CATEGORY FILTER */}
        <div className="flex gap-3 overflow-x-auto mb-8 pb-2">
          <Link
            href="/blogs"
            className={`px-4 py-2 rounded-full border text-sm font-semibold ${
              !categorySlug
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white"
            }`}
          >
            All
          </Link>

          {categories?.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blogs?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                categorySlug === cat.slug
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-white"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* SEARCH */}
        <form className="mb-10 flex gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search blogs..."
            defaultValue={search}
            className="w-64 border px-4 py-2 rounded-lg"
          />
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg">
            Search
          </button>
        </form>

        {/* BLOG GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs?.map((blog) => {
            const firstCategory =
              blog.blog_categories?.[0]?.categories;

            return (
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
                  {firstCategory && (
                    <span className="text-sm text-orange-600 font-semibold block mb-2">
                      {firstCategory.name}
                    </span>
                  )}

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
            );
          })}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (p) => (
                <Link
                  key={p}
                  href={`/blogs?page=${p}${
                    search ? `&search=${search}` : ""
                  }${
                    categorySlug ? `&category=${categorySlug}` : ""
                  }`}
                  className={`px-4 py-2 rounded-lg border ${
                    p === page
                      ? "bg-orange-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {p}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

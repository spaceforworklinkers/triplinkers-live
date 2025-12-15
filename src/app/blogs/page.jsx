import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Search, Calendar, ArrowRight, Filter } from "lucide-react";

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

  /* ===============================
     FETCH ONLY CATEGORIES
     THAT HAVE PUBLISHED BLOGS
  =============================== */
  const { data: categoryRows } = await supabase
    .from("blog_categories")
    .select(
      `
      categories (
        name,
        slug
      ),
      blogs!inner (
        id,
        status
      )
      `
    )
    .eq("blogs.status", "published");

  // Deduplicate categories
  const categories = Array.from(
    new Map(
      (categoryRows || []).map((row) => [
        row.categories.slug,
        row.categories,
      ])
    ).values()
  );

  /* ===============================
     BLOG QUERY
  =============================== */
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
      blog_categories (
        categories (
          name,
          slug
        )
      )
      `,
      { count: "exact" }
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (search) {
    query = query.textSearch("title", search, { type: "websearch" });
  }

  if (categorySlug) {
    query = query.eq("blog_categories.categories.slug", categorySlug);
  }

  const { data: blogs, count } = await query.range(
    offset,
    offset + limit - 1
  );

  const totalPages = Math.ceil((count || 0) / limit);

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Travel Stories & Guides</h1>
          <p className="text-xl text-orange-100 max-w-2xl">
            Discover inspiring destinations, expert tips, and unforgettable travel experiences
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">
        {/* Search Bar - Elevated Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="search"
                placeholder="Search for destinations, tips, guides..."
                defaultValue={search}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              />
            </div>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-md shadow-orange-200">
              <Search className="w-5 h-5" />
              Search
            </button>
          </form>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filter by Category</h2>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            <Link
              href="/blogs"
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                !categorySlug
                  ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:shadow-sm"
              }`}
            >
              All Posts
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blogs?category=${cat.slug}`}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  categorySlug === cat.slug
                    ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:shadow-sm"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-800">{blogs?.length || 0}</span> of{" "}
            <span className="font-semibold text-gray-800">{count || 0}</span> articles
          </p>
        </div>

        {/* Blog Grid */}
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {blogs.map((blog) => {
              const firstCategory = blog.blog_categories?.[0]?.categories;

              return (
                <article
                  key={blog.id}
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {blog.featured_image ? (
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    {firstCategory && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/95 backdrop-blur-sm text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                          {firstCategory.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={blog.published_at}>
                        {formatDate(blog.published_at || blog.created_at)}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                      {blog.excerpt || "Click to read more about this exciting travel story..."}
                    </p>

                    {/* Read More Link */}
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all group/link"
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all"
            >
              View all articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pb-16">
            {/* Previous Button */}
            {page > 1 && (
              <Link
                href={`/blogs?page=${page - 1}${search ? `&search=${search}` : ""}${categorySlug ? `&category=${categorySlug}` : ""}`}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold hover:border-orange-300 hover:shadow-sm transition-all"
              >
                Previous
              </Link>
            )}

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  p === 1 ||
                  p === totalPages ||
                  (p >= page - 1 && p <= page + 1);

                if (!showPage) {
                  // Show ellipsis
                  if (p === page - 2 || p === page + 2) {
                    return (
                      <span key={p} className="px-4 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <Link
                    key={p}
                    href={`/blogs?page=${p}${search ? `&search=${search}` : ""}${categorySlug ? `&category=${categorySlug}` : ""}`}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      p === page
                        ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:shadow-sm"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            {/* Next Button */}
            {page < totalPages && (
              <Link
                href={`/blogs?page=${page + 1}${search ? `&search=${search}` : ""}${categorySlug ? `&category=${categorySlug}` : ""}`}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold hover:border-orange-300 hover:shadow-sm transition-all"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
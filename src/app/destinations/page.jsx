import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Explore Destinations | TripLinkers",
  description:
    "Discover international travel destinations with curated guides, best times to visit, and expert insights by TripLinkers.",
};

export default async function DestinationsPage({ searchParams }) {
  const params = await searchParams;

  const search = params.search || "";

  let query = supabaseAdmin
    .from("destinations")
    .select(
      `
      id,
      name,
      slug,
      short_description,
      best_time,
      hero_images
      `
    )
    .eq("status", "published")
    .order("name");

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data: destinations } = await query;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            Explore Destinations
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl">
            Handpicked destinations, travel insights, and expert planning for your next journey
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="search"
                placeholder="Search destinations like Dubai, Bali, Paris..."
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

        {/* Results */}
        {destinations && destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {destinations.map((d) => (
              <article
                key={d.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {d.hero_images?.[0] ? (
                    <img
                      src={d.hero_images[0]}
                      alt={d.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <MapPin className="w-14 h-14" />
                    </div>
                  )}

                  {/* Overlay Title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">
                    {d.name}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  {d.best_time && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      Best time: {d.best_time}
                    </div>
                  )}

                  <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                    {d.short_description ||
                      "Explore this destination with custom itineraries, expert insights, and tailored travel plans."}
                  </p>

                  <Link
                    href={`/destinations/${d.slug}`}
                    className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all"
                  >
                    Explore Destination
                    <ArrowRight className="w-4 h-4 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No destinations found
            </h3>
            <p className="text-gray-600 mb-6">
              Try searching with a different keyword
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all"
            >
              View all destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

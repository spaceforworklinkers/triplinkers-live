import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const metadata = {
  title: "Travel Packages | TripLinkers",
  description: "Explore curated travel packages with itinerary, cost and destination details.",
};

export default async function PackagesPage() {
  const { data: packages } = await supabaseAdmin
    .from("packages")
    .select("id, title, slug, banner_url, destination, price, days")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Travel Packages
        </h1>

        {packages?.length === 0 && (
          <p className="text-gray-500">No packages available.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages?.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/packages/${pkg.slug}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative h-56">
                <Image
                  src={pkg.banner_url}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {pkg.title}
                </h2>

                <p className="text-sm text-gray-500">
                  {pkg.destination} • {pkg.days} Days
                </p>

                <p className="text-orange-600 font-bold">
                  ₹{pkg.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

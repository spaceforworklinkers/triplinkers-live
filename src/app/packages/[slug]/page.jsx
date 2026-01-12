import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Image from "next/image";
import { Check, X } from "lucide-react";
import PackageLeadAction from "./PackageLeadAction";

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { data: pkg } = await supabaseAdmin
    .from("packages")
    .select("title, short_desc, destination")
    .eq("slug", slug)
    .single();

  if (!pkg) return {};

  return {
    title: `${pkg.title} | TripLinkers`,
    description: pkg.short_desc?.replace(/<[^>]*>/g, "").slice(0, 160) || `Book your ${pkg.title} with TripLinkers.`,
  };
}

export default async function PackageDetailPage({ params }) {
  const { slug } = params;

  const { data: pkg } = await supabaseAdmin
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!pkg) {
    notFound();
  }

  const renderList = (data, isExclusion = false) => {
    if (!data) return null;
    if (Array.isArray(data)) {
      return (
        <ul className="space-y-2 mt-2">
          {data.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-slate-700">
              {isExclusion ? <X className="text-red-500 w-4 h-4" /> : <Check className="text-green-500 w-4 h-4" />}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <div className="prose max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: data }} />;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[420px] w-full">
        {pkg.banner_url ? (
          <Image src={pkg.banner_url} alt={pkg.title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold">{pkg.title}</h1>
          <p className="text-sm mt-2">{pkg.location || pkg.destination} • {pkg.duration || pkg.days} Days</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <span className="text-2xl font-bold text-orange-600">₹{pkg.price}</span>
        </div>

        {pkg.short_description || pkg.short_desc && (
          <div className="prose max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: pkg.short_description || pkg.short_desc }} />
        )}

        {pkg.itinerary && (
          <section>
            <h2 className="text-2xl font-semibold mb-3">Itinerary</h2>
            <div className="prose max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: pkg.itinerary }} />
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="bg-green-100 text-green-600 p-1 rounded"><Check size={20} /></span> Inclusions
            </h3>
            {renderList(pkg.inclusions)}
          </div>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="bg-red-100 text-red-600 p-1 rounded"><X size={20} /></span> Exclusions
            </h3>
            {renderList(pkg.exclusions, true)}
          </div>
        </div>
      </div>
      <PackageLeadAction pkg={pkg} />
    </div>
  );
}

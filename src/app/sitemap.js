import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const baseUrl = "https://triplinkers.com"; // change this to your actual domain

  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug");

  const blogUrls = blogs.map((b) => `
    <url>
      <loc>${baseUrl}/blogs/${b.slug}</loc>
      <changefreq>weekly</changefreq>
    </url>
  `).join("");

  const xml = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}/blogs</loc>
        <changefreq>daily</changefreq>
      </url>
      ${blogUrls}
    </urlset>
  `;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" }
  });
}

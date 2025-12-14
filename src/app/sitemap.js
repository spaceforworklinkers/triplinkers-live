import { supabase } from "@/lib/supabaseClient";

export default async function sitemap() {
  const baseUrl = "https://triplinkers.com";

  // Fetch ONLY published blogs
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select("slug, updated_at")
    .eq("status", "published");

  if (error || !blogs) {
    return [
      {
        url: `${baseUrl}/blogs`,
        changeFrequency: "daily",
        priority: 0.8,
      },
    ];
  }

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: blog.updated_at || new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...blogUrls,
  ];
}

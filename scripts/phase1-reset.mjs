import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const categories = [
  { name: "Honeymoon", slug: "honeymoon" },
  { name: "Family", slug: "family" },
  { name: "Adventure", slug: "adventure" },
  { name: "Luxury", slug: "luxury" },
  { name: "Budget", slug: "budget" },
  { name: "International", slug: "international" }
];

async function resetAndSeed() {
  console.log("🚀 Starting Production Reset...");

  const tables = ["leads", "packages", "destinations", "blog_categories", "blogs", "categories"];
  
  for (const table of tables) {
    console.log(`🧹 Cleaning table: ${table}...`);
    const { error } = await supabaseAdmin.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) console.error(`❌ Error cleaning ${table}:`, error.message);
  }

  console.log("🌱 Seeding Categories...");
  const { error: catError } = await supabaseAdmin.from("categories").insert(categories);
  if (catError) console.error("❌ Error seeding categories:", catError.message);
  else console.log("✅ Categories seeded.");

  console.log("🎉 Phase 1 Complete.");
}

resetAndSeed();

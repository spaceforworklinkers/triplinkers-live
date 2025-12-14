export async function generateUniqueSlug({ supabase, table, slug }) {
  let finalSlug = slug;
  let counter = 1;

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("id")
      .eq("slug", finalSlug)
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      break;
    }

    counter++;
    finalSlug = `${slug}-${counter}`;
  }

  return finalSlug;
}

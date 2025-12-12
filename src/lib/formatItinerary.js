export function formatItinerary(text) {
  if (!text) return "";

  let html = text;

  // H3 headings (###)
  html = html.replace(/^### (.*)$/gm, `<h3 class="text-xl font-bold mt-6 mb-2 text-gray-900">$1</h3>`);

  // H2 headings (##)
  html = html.replace(/^## (.*)$/gm, `<h2 class="text-2xl font-bold mt-8 mb-3 text-gray-900">$1</h2>`);

  // H1 headings (#)
  html = html.replace(/^# (.*)$/gm, `<h1 class="text-3xl font-bold mt-10 mb-5 text-gray-900">$1</h1>`);

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, `<b class="font-semibold text-gray-900">$1</b>`);

  // Bullet list
  html = html.replace(/^- (.*)$/gm, `<li class="list-disc ml-5 text-gray-800">$1</li>`);

  // Numbered list
  html = html.replace(/^\d+\. (.*)$/gm, `<li class="list-decimal ml-5 text-gray-800">$1</li>`);

  // Auto wrap <li> inside <ul>
  html = html.replace(/(<li.*<\/li>)/gm, `<ul class="my-2">$1</ul>`);

  // Line breaks → <br/>
  html = html.replace(/(?:\r\n|\r|\n)/g, `<br/>`);

  return html;
}

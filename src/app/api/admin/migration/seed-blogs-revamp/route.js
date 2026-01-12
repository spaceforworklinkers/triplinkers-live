import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Helper to generate a future date for "published_at" to stagger them slightly or just set to now
const now = new Date().toISOString();

const blogs = [
  {
    title: "The Ultimate Guide to a Budget Thailand Trip from India (2025 Edition)",
    slug: "budget-thailand-trip-from-india-cost-guide",
    excerpt: "Planning a trip to Thailand from India? From visa-on-arrival fees to street food costs, here is your complete budget breakdown for a 7-day itinerary.",
    image_url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2039&auto=format&fit=crop",
    category_id: null, // Will be mapped dynamically if needed, or fetched by slug
    content: `
      <h1>The Ultimate Guide to a Budget Thailand Trip from India (2025 Edition)</h1>
      <p>Thailand remains the undisputed king of international travel for Indians. It’s close, it’s affordable, and with the recent <strong>visa-free checks (or easy Visa-on-Arrival)</strong> policies for Indian passport holders, it has never been more accessible. But "budget" doesn't mean compromising on experience. In this comprehensive guide, we break down exactly how you can plan a luxurious-feeling 7-day trip to the Land of Smiles without burning a hole in your pocket.</p>

      <h2>1. Flight Routes & Booking Hacks</h2>
      <p>The biggest chunk of your budget will inevitably be your flights. To save money, flexibility is key.</p>
      <ul>
        <li><strong>Direct Hubs:</strong> The cheapest direct flights usually depart from <strong>Kolkata (CCU)</strong>, <strong>Chennai (MAA)</strong>, and <strong>Bangalore (BLR)</strong>. If you are flying from Delhi or Mumbai, look for connecting flights via these hubs if direct fares are high.</li>
        <li><strong>Best Time to Book:</strong> Aim for 2-3 months in advance. Flash sales by airlines like AirAsia, Indigo, and Thai Lion Air often drop return fares to as low as ₹12,000 - ₹15,000 INR.</li>
        <li><strong>Landing in Bangkok:</strong> You have two airports—<strong>Suvarnabhumi (BKK)</strong> and <strong>Don Mueang (DMK)</strong>. DMK generally hosts budget carriers, while BKK connects to the city via a fast Airport Rail Link.</li>
      </ul>

      <h2>2. Visa Requirements for Indians</h2>
      <p>Great news! Thailand has been very generous with visa policies for Indians recently. As of late 2024/2025, Thailand often offers <strong>Visa-Free entry</strong> for temporary periods to boost tourism. Always check the latest Royal Thai Embassy updates before flying.</p>
      <p><strong>If Visa-on-Arrival (VoA) is active:</strong></p>
      <ul>
        <li><strong>Cost:</strong> 2,000 THB (approx. ₹4,800 INR).</li>
        <li><strong>Fast Track:</strong> Pay an extra 200 THB to skip the long queues—totally worth it after a 4-hour flight.</li>
        <li><strong>Documents:</strong> Return flight ticket (within 15 days), proof of accommodation, and funds (10,000 THB per person).</li>
      </ul>

      <h2>3. 7-Day Budget Itinerary</h2>
      <p>Don't try to see the whole country in one go. For a first-timer, stick to the classic route.</p>
      
      <h3>Days 1-3: Bangkok – Chaos & Culture</h3>
      <p>Start with the capital. Take the <strong>Chao Phraya Express Boat</strong> heavily used by locals—it costs about ₹30-₹40 INR and gives you a river tour better than any expensive cruise.</p>
      <ul>
        <li><strong>Must Visit:</strong> Wat Arun (Temple of Dawn) at sunset.</li>
        <li><strong>Budget Shopping:</strong> Skip the malls and hit <strong>Chatuchak Weekend Market</strong> or <strong>Pratunam Market</strong> for clothes at wholesale prices.</li>
        <li><strong>Street Food:</strong> Pad Thai goes for 50 THB (₹120) on the street. Don't fear the street stalls; look for high turnover and hot woks.</li>
      </ul>

      <h3>Days 4-5: Pattaya or Ayutthaya?</h3>
      <p>If you want beaches and nightlife, head to <strong>Pattaya</strong> (2 hours by bus, cost ₹300). If you want history and ruins reminiscent of Hampi, take a train to <strong>Ayutthaya</strong> (1.5 hours, cost ₹50).</p>
      
      <h3>Days 6-7: Phuket or Krabi – Island Life</h3>
      <p>Catch a domestic flight (book early for ₹2,500 one way) to the south. <strong>Krabi</strong> is generally more scenic and slightly cheaper than Phuket. Stay in <strong>Ao Nang</strong> for easy access to island-hopping boats.</p>

      <h2>4. Cost Breakdown (Per Person)</h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2">Expense Category</th>
              <th class="border p-2">Estimated Cost (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2">Flights (Return)</td>
              <td class="border p-2">₹18,000 - ₹25,000</td>
            </tr>
            <tr>
              <td class="border p-2">Accommodation (6 Nights, Hostels/Budget Hotels)</td>
              <td class="border p-2">₹8,000 - ₹12,000</td>
            </tr>
            <tr>
              <td class="border p-2">Food & Drinks</td>
              <td class="border p-2">₹7,000 - ₹10,000</td>
            </tr>
            <tr>
              <td class="border p-2">Local Transport & Activities</td>
              <td class="border p-2">₹5,000</td>
            </tr>
            <tr>
              <td class="border p-2"><strong>Total</strong></td>
              <td class="border p-2"><strong>₹38,000 - ₹52,000</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>5. Pro-Tips for Indians</h2>
      <ul>
        <li><strong>Currency Exchange:</strong> Do NOT exchange Rupees at the airport in India. Bring USD (100 dollar bills get better rates) and exchange them at <strong>SuperRich</strong> exchange booths in Bangkok.</li>
        <li><strong>SIM Card:</strong> Buy a tourist SIM at a 7-Eleven in the city, not at the airport. You'll save 50%.</li>
        <li><strong>Vegetarian Food:</strong> Look for the yellow flag with red Chinese characters—that indicates "Jay" (vegan/vegetarian) food. Also, Indian restaurants are everywhere, though slightly pricier.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>
      <details class="mb-4">
        <summary class="cursor-pointer font-bold text-orange-600">Is Thailand safe for solo female travelers?</summary>
        <p class="mt-2">Yes, Thailand is one of the safest destinations in SEA. Standard precautions apply, but violent crime against tourists is rare.</p>
      </details>
      <details class="mb-4">
        <summary class="cursor-pointer font-bold text-orange-600">Can I use UPI in Thailand?</summary>
        <p class="mt-2">While some tourist spots accept it via cross-border partnerships, <strong>Cash is King</strong> in budget markets. Always carry Thai Baht.</p>
      </details>

      <div class="bg-blue-50 p-6 rounded-lg mt-8">
        <h3 class="font-bold text-lg mb-2">Ready to plan your trip?</h3>
        <p>Check out our curated <a href="/packages/thailand-beach-holidays" class="text-orange-600 underline">Thailand Tour Packages</a> for hassle-free planning including flights and visa assistance.</p>
      </div>
    `,
  },
  {
    title: "Luxury Maldives Honeymoon Guide: Water Villas & Experiences",
    slug: "luxury-maldives-honeymoon-guide",
    excerpt: "Dreaming of waking up over the ocean? A Maldives honeymoon is the ultimate romantic escape. Here is how to choose the right island and maximizing your luxury experience.",
    image_url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1974&auto=format&fit=crop",
    category_id: null,
    content: `
      <h1>Luxury Maldives Honeymoon Guide: Water Villas & Experiences</h1>
      <p>The Maldives isn't just a destination; it's an emotion. For honeymooners, it represents the pinnacle of romance—secluded sandbanks, crystal-clear turquoise waters, and the iconic overwater villas. But with over 1,000 islands and 150+ resorts, choosing the "perfect" one can be overwhelming. This editorial guide helps Indian couples navigate the luxury landscape of the Maldives.</p>

      <h2>1. The "One Island, One Resort" Concept</h2>
      <p>Unlike Bali or Thailand, most resorts in the Maldives occupy their own private island. This means you are captive to that island's restaurants, beaches, and activities. <strong>Choosing the right resort is everything.</strong></p>
      <ul>
        <li><strong>North Malé Atoll:</strong> Close to the airport (speedboard transfer). Great for short trips but can see some boat traffic.</li>
        <li><strong>Baa Atoll:</strong> A UNESCO Biosphere Reserve. The best place to spot Manta Rays and Whale Sharks. Requires a Seaplane transfer (more expensive but scenic).</li>
      </ul>

      <h2>2. Water Villa vs. Beach Villa?</h2>
      <p>The million-dollar question. While Instagram sells the Water Villa dream, here is the reality:</p>
      <ul>
        <li><strong>Water Villas:</strong> incredible views, direct ocean access, and privacy. <em>Cons:</em> Can be noisy if the waves are rough, and a long walk to the main restaurant.</li>
        <li><strong>Beach Villas:</strong> Direct access to white sand, private gardens, and often outdoor showers. <em>Cons:</em> Less "iconic" view.</li>
        <li><strong>Pro Tip:</strong> <strong>Split your stay!</strong> Book 2 nights in a Beach Villa and 2 nights in a Water Villa. You get the best of both worlds and save money.</li>
      </ul>

      <h2>3. Meal Plans: Go All-Inclusive</h2>
      <p>In the Maldives, a bottle of water can cost $10 and a burger $35. A la carte dining adds up incredibly fast.</p>
      <ul>
        <li><strong>All-Inclusive (AI):</strong> Includes all meals and unlimited alcohol/mocktails. This is statistically the best value for Indian drinkers/foodies.</li>
        <li><strong>Full Board (FB):</strong> Breakfast, Lunch, Dinner. Drinks chargeable.</li>
        <li><strong>Half Board (HB):</strong> Breakfast and Dinner. Good if you skip lunch, but risky.</li>
      </ul>

      <h2>4. Top Romantic Experiences</h2>
      <p>Don't just sit in the room. Enhancing your honeymoon with these add-ons makes it unforgettable:</p>
      <ol>
        <li><strong>Floating Breakfast:</strong> Yes, it’s a cliché, but it’s a fun one. Have your eggs benedict served on a tray in your private pool.</li>
        <li><strong>Sunset Dolphin Cruise:</strong> Most resorts offer this. Seeing hundreds of spinner dolphins jumping at sunset is magical.</li>
        <li><strong>Candlelight Dinner on a Sandbank:</strong> Absolute isolation. Just you, your partner, a chef, and the ocean.</li>
      </ol>

      <h2>5. Budgeting for Luxury</h2>
      <p>A high-end 4-night honeymoon typically costs between <strong>₹2 Lakh to ₹4 Lakh INR</strong> per couple, depending on the season.</p>
      <p><strong>Cheapest Month:</strong> May to September (Monsoon season brings showers but prices drop by 40%).</p>
      <p><strong>Most Expensive:</strong> December to February (Peak winter sun).</p>

      <h2>Frequently Asked Questions</h2>
      <details class="mb-4">
        <summary class="cursor-pointer font-bold text-orange-600">Do we need a Visa?</summary>
        <p class="mt-2">No. Maldives offers <strong>Visa on Arrival</strong> for free to Indians for 30 days. You just need a passport validity of 6 months and a return ticket.</p>
      </details>
      <details class="mb-4">
        <summary class="cursor-pointer font-bold text-orange-600">Can we bring alcohol from Duty-Free?</summary>
        <p class="mt-2"><strong>Absolutely NOT.</strong> The Maldives is a strict Muslim country. Alcohol is confiscated at the airport. You can only consume alcohol within your resort island.</p>
      </details>

      <div class="bg-blue-50 p-6 rounded-lg mt-8">
        <h3 class="font-bold text-lg mb-2">Book Your Dream Escape</h3>
        <p>Explore our exclusive <a href="/packages/maldives-honeymoon" class="text-orange-600 underline">Maldives Honeymoon Packages</a> featuring free seaplane transfers and honeymoon freebies.</p>
      </div>
    `,
  },
  {
    title: "Dubai with Kids: The Ultimate 5-Day Family Itinerary",
    slug: "dubai-family-trip-itinerary-with-kids",
    excerpt: "Taking the family to Dubai? From theme parks to desert safaris, here is the perfect 5-day plan that keeps both kids and parents happy.",
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea904ac6666?q=80&w=2070&auto=format&fit=crop",
    category_id: null,
    content: `
      <h1>Dubai with Kids: The Ultimate 5-Day Family Itinerary</h1>
      <p>Dubai is arguably the best family destination in the world right now. It is safe, clean, just a 3-4 hour flight from India, and packed with activities that defy imagination. Whether your kids are toddlers or teenagers, Dubai has something to wow them. This guide outlines a fast-paced, fun-filled 5-day itinerary tailored for Indian families.</p>

      <h2>Day 1: Arrival & The Icons</h2>
      <p>Land in Dubai, check into your hotel (aim for the <strong>Al Barsha</strong> or <strong>Downtown</strong> area for easy metro access).</p>
      <ul>
        <li><strong>Evening:</strong> Head straight to the <strong>Dubai Mall</strong>. It’s not just shopping; it’s an entertainment hub.</li>
        <li><strong>Must Do:</strong> Watch the <strong>Dubai Fountain</strong> show (free every 30 mins) and visit the huge <strong>Dubai Aquarium</strong> tunnel.</li>
        <li><strong>Dinner:</strong> Grab a meal at the Food Court or a restaurant overlooking the fountains.</li>
      </ul>

      <h2>Day 2: Modern Marvels & Views</h2>
      <ul>
        <li><strong>Morning:</strong> <strong>Burj Khalifa (At The Top)</strong>. Book the 124th/125th floor slot for 10 AM to avoid crowds. The elevator ride alone is a thrill for kids.</li>
        <li><strong>Afternoon:</strong> <strong>Museum of the Future</strong>. This is crucial—book tickets 3 weeks in advance as they sell out. It’s visually stunning and interactive for children.</li>
        <li><strong>Evening:</strong> <strong>Dubai Frame</strong>. Walk on the glass floor 150 meters high. It separates "Old Dubai" from "New Dubai" visually.</li>
      </ul>

      <h2>Day 3: Theme Park Thrills</h2>
      <p>Dubai Parks and Resorts is a massive complex. Dedicate a full day here.</p>
      <ul>
        <li><strong>For Little Kids:</strong> <strong>Legoland Dubai</strong>. It’s perfect for ages 2-10 with gentle rides and building zones.</li>
        <li><strong>For Teens:</strong> <strong>Motiongate Dubai</strong>. Think ‘Hunger Games’ and ‘John Wick’ rollercoasters. Hollywood comes alive here.</li>
      </ul>

      <h2>Day 4: Snow & Sand</h2>
      <p>A day of contrasts—the hallmark of Dubai.</p>
      <ul>
        <li><strong>Morning:</strong> <strong>Ski Dubai</strong> at Mall of the Emirates. Yes, real snow in the desert. The penguin encounter is expensive but magical for children.</li>
        <li><strong>Afternoon (3 PM):</strong> <strong>Desert Safari</strong>. This is non-negotiable. Dune bashing in 4x4s, camel rides, henna painting, and a BBQ dinner with Fire Shows. Kids absolutely love the sandboarding.</li>
      </ul>

      <h2>Day 5: Old Dubai & Departure</h2>
      <p>Show the kids the history before the skyscrapers.</p>
      <ul>
        <li>Visit the <strong>Al Fahidi Historical Neighborhood</strong>.</li>
        <li>Take an <strong>Abra (traditional boat)</strong> ride across the creek for just 1 AED.</li>
        <li>Buy spices and gold (or window shop) in the <strong>Gold Souk</strong>.</li>
      </ul>

      <h2>Essential Tips for Indian Families</h2>
      <ul>
        <li><strong>Food:</strong> Indian food is available on every corner. From Saravana Bhavan to high-end dining like Tresind, you will never miss home food.</li>
        <li><strong>Transport:</strong> The <strong>Dubai Metro</strong> is fantastic. Buy a specific 'Nol' card (Silver) for everyone. Kids under 5 travel free.</li>
        <li><strong>Weather:</strong> Avoid July/August unless you plan to stay purely indoors. October to March is perfect outdoor weather.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>
      <details class="mb-4">
        <summary class="cursor-pointer font-bold text-orange-600">Do kids need a separate Visa?</summary>
        <p class="mt-2">Yes, every passport holder needs a visa. However, during summer, Dubai often runs "Kids Go Free" campaigns where visas and hotel stays for kids are complimentary. Check our packages for current offers.</p>
      </details>

      <div class="bg-blue-50 p-6 rounded-lg mt-8">
        <h3 class="font-bold text-lg mb-2">Want a custom family package?</h3>
        <p>Browse our <a href="/packages/dubai-family-tours" class="text-orange-600 underline">Dubai Family Packages</a> which include visa processing and attraction tickets.</p>
      </div>
    `,
  },
  {
    title: "Varanasi Travel Guide: Ghats, Temples & Costs for Pilgrims",
    slug: "varanasi-travel-guide-spiritual-journey",
    excerpt: "A trip to Kashi is not just a holiday; it's a calling. Explore the spiritual heart of India with our guide to the Ghats, the Ganga Aarti, and local hidden gems.",
    image_url: "https://images.unsplash.com/photo-1561361513-35bdcd07fb59?q=80&w=2070&auto=format&fit=crop",
    category_id: null,
    content: `
      <h1>Varanasi Travel Guide: Ghats, Temples & Costs for Pilgrims</h1>
      <p>Mark Twain once wrote, "Benaras is older than history, older than tradition, older even than legend, and looks twice as old as all of them put together." For the Indian traveler, a trip to <strong>Varanasi (Kashi)</strong> is often a bucket-list spiritual goal. But beyond the chaos and the crowds lies a city of profound peace and culture. Here is how to navigate the world's oldest living city.</p>

      <h2>1. The Spiritual Core: Kashi Vishwanath</h2>
      <p>The <strong>Kashi Vishwanath Corridor</strong> has transformed the pilgrimage experience. Gone are the days of navigating incredibly narrow, dirty lanes to reach the sanctum.</p>
      <ul>
        <li><strong>Darshan Tips:</strong> Book the 'Sugam Darshan' online (approx. ₹300) to skip the general queue, which can take 4-5 hours on Mondays.</li>
        <li><strong>Dress Code:</strong> Traditional wear is encouraged but not strictly enforced, though modest clothing is a must.</li>
        <li><strong>Mobile Phones:</strong> Not allowed inside the main temple complex. Lockers are available, but it's safer to leave them at your hotel.</li>
      </ul>

      <h2>2. The Ganga Aarti Experience</h2>
      <p>The evening Aarti at <strong>Dashashwamedh Ghat</strong> is a spectacle of fire and devotion. But it gets crowded.</p>
      <ul>
        <li><strong>Pro Tip:</strong> Don't watch it from the steps. Hire a private boat (approx. ₹500-₹800) around 5:30 PM. Park the boat right in front of the platform for an unobstructed view from the water. It is magical.</li>
        <li><strong>Morning Aarti:</strong> Assi Ghat hosts a 'Subah-e-Banaras' Aarti at sunrise which is much more peaceful and includes classical music.</li>
      </ul>

      <h2>3. Food Walk: The Taste of Banaras</h2>
      <p>You cannot leave Varanasi without trying the street food.</p>
      <ul>
        <li><strong>Kachori Sabzi:</strong> The standard breakfast. Try it at <strong>Ram Bhandar</strong>.</li>
        <li><strong>Blue Lassi:</strong> A famous little shop near Manikarnika Ghat serving lassi with fruit toppings.</li>
        <li><strong>Tamatar Chaat:</strong> Unique to Varanasi. <strong>Kashi Chat Bhandar</strong> serves the best version.</li>
        <li><strong>Malaiyo:</strong> A winter-only delicacy made of milk foam and saffron. It literally melts in your mouth.</li>
      </ul>

      <h2>4. Where to Stay?</h2>
      <ul>
        <li><strong>Godowlia/Ghats:</strong> Stay here if you want to be in the thick of action. You will walk everywhere.</li>
        <li><strong>Cantonment:</strong> Stay here for luxury hotels (Taj, Ramada) and peace. You will need a rickshaw to get to the river (30 mins).</li>
      </ul>

      <h2>5. Budget for a 3-Day Trip</h2>
      <p>Varanasi is incredibly budget-friendly.</p>
      <ul>
        <li><strong>Hotel:</strong> ₹2,000 - ₹4,000 per night for a decent 3-star.</li>
        <li><strong>Food:</strong> ₹500 per day (Street food is cheap and safe if eaten hot).</li>
        <li><strong>Transport:</strong> Cycle rickshaws cost ₹50-₹100.</li>
        <li><strong>Total:</strong> A comfortable 3-day trip can be done in <strong>₹10,000 - ₹12,000 per person</strong> (excluding flights/trains).</li>
      </ul>

      <h2>Frequently Asked Questions</h2>
      <details class="mb-4">
        <summary class="cursor-pointer font-bold text-orange-600">Is it safe to bathe in the Ganga?</summary>
        <p class="mt-2">Thousands do it daily. However, the water quality varies. Many pilgrims prefer to sprinkle the water on themselves or take a dip at cleaner designated spots like Assi Ghat, but avoid drinking it directly.</p>
      </details>

      <div class="bg-blue-50 p-6 rounded-lg mt-8">
        <h3 class="font-bold text-lg mb-2">Plan Your Teerth Yatra</h3>
        <p>Looking for a guided spiritual tour? View our <a href="/packages/temple-tours" class="text-orange-600 underline">Varanasi & Ayodhya Temple Packages</a>.</p>
      </div>
    `,
  },
  {
    title: "Goa Beyond Beaches: Heritage, Spice Farms & Local Cuisine",
    slug: "goa-offbeat-travel-guide",
    excerpt: "Think Goa is just about Baga and Calangute? Think again. Discover the Portuguese heritage, secret islands, and spice plantations of the 'Real Goa'.",
    image_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop",
    category_id: null,
    content: `
      <h1>Goa Beyond Beaches: Heritage, Spice Farms & Local Cuisine</h1>
      <p>For most Indians, Goa means cheap alcohol and crowded beaches. But peel back the touristy layer of North Goa, and you find a state rich in colonial history, lush biodiversity, and distinct cuisine. If you've "done" Goa before, this guide is for your next mature, experiential trip.</p>

      <h2>1. Fontainhas: The Latin Quarter</h2>
      <p>Located in Panjim, this is the only Latin Quarter in Asia. Walking here feels like stepping into Lisbon.</p>
      <ul>
        <li><strong>Architecture:</strong> Bright yellow, blue, and sprawling heritage homes with oyster-shell windows.</li>
        <li><strong>Do:</strong> Take a heritage walking tour. Visit the <strong>Gitanjali Gallery</strong> for art and coffee.</li>
        <li><strong>Eat:</strong> Have a Goan Fish Thali at an old Portuguese home-turned-restaurant like <strong>Viva Panjim</strong>.</li>
      </ul>

      <h2>2. Divar Island: The Time Capsule</h2>
      <p>Take a free ferry from Old Goa to <strong>Divar Island</strong>. Time stops here. There are no nightclubs, just paddy fields and Baroque churches on hilltops.</p>
      <ul>
        <li><strong>Bonederam Festival:</strong> If you visit in August, catch this unique flag festival.</li>
        <li><strong>Cycle Tour:</strong> Rent an e-bike to explore the sleepy roads. It is arguably the most peaceful place in Goa.</li>
      </ul>

      <h2>3. Spice Plantations</h2>
      <p>Head inland to Ponda. The <strong>Sahakari Spice Farm</strong> or <strong>Tropical Spice Plantation</strong> offers a fantastic day trip.</p>
      <ul>
        <li><strong>Tour:</strong> Walk through dense forests of cardamom, vanilla, and pepper.</li>
        <li><strong>Lunch:</strong> The entry ticket usually includes a verified authentic Goan buffet served on banana leaves, with Feni tasting.</li>
      </ul>

      <h2>4. South Goa's Hidden Gems</h2>
      <p>Skip Calangute. Head South.</p>
      <ul>
        <li><strong>Cola Beach:</strong> A rare beach with a freshwater lagoon right next to the sea. You can kayak in the lagoon and swim in the sea within minutes.</li>
        <li><strong>Cabo de Rama Fort:</strong> A crumbling fort with one of the most dramatic cliff-views of the Arabian Sea. Perfect for sunsets minus the crowds.</li>
      </ul>

      <h2>5. What to Eat (Beyond Vindaloo)</h2>
      <p>Goan cuisine is complex.</p>
      <ul>
        <li><strong>Chicken Xacuti:</strong> A curry made with roasted spices and coconut.</li>
        <li><strong>Poi:</strong> The local leavened bread. Eat it with...</li>
        <li><strong>Ros Omelette:</strong> An omelette drowned in spicy chicken gravy (Xacuti). It’s the ultimate street food dinner.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>
      <details class="mb-4">
        <summary class="cursor-pointer font-bold text-orange-600">Do I need a car in Goa?</summary>
        <p class="mt-2">To explore beyond the beaches, yes. Renting a self-drive car (Thar or Hatchback) is the best way to travel. Taxis are unionized and notoriously expensive.</p>
      </details>

      <div class="bg-blue-50 p-6 rounded-lg mt-8">
        <h3 class="font-bold text-lg mb-2">Experience the Real Goa</h3>
        <p>Book our curated <a href="/packages/goa-honeymoon" class="text-orange-600 underline">Goa Luxury & Heritage Packages</a> for a different kind of vibe.</p>
      </div>
    `,
  }
];

export async function GET() {
  try {
    const results = [];
    
    // We need to fetch basic stats mostly for category mapping if we wanted to be precise, 
    // but for now we'll write them with null category_id or fetch dynamically.
    // Actually, let's try to map them to categories if possible.
    
    // Fetch categories to map
    const { data: categories } = await supabaseAdmin.from('categories').select('id, slug');
    
    for (const blog of blogs) {
      // Auto-assign category based on slug keywords
      let catId = null;
      if (categories) {
        if (blog.slug.includes('thailand')) catId = categories.find(c => c.slug === 'adventure')?.id || categories.find(c => c.slug === 'budget')?.id;
        if (blog.slug.includes('maldives')) catId = categories.find(c => c.slug === 'honeymoon')?.id;
        if (blog.slug.includes('dubai')) catId = categories.find(c => c.slug === 'family')?.id;
        if (blog.slug.includes('varanasi')) catId = categories.find(c => c.slug === 'spiritual')?.id;
        if (blog.slug.includes('goa')) catId = categories.find(c => c.slug === 'beaches')?.id;
      }
      
      const payload = {
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt, // CORRECT COLUMN
        content: blog.content,
        featured_image: blog.image_url, // CORRECT COLUMN
        status: "published",
        seo_title: blog.title,
        seo_description: blog.excerpt,
        published_at: now
      };

      const { data, error } = await supabaseAdmin
        .from("blogs")
        .upsert(payload, { onConflict: 'slug' })
        .select()
        .single();
        
      if (error) {
        console.error(`Error seeding ${blog.title}:`, error);
        results.push({ title: blog.title, status: "failed", error: error.message });
      } else {
        // If successful and we have a category, map it
        if (catId && data.id) {
           const { error: mapError } = await supabaseAdmin
            .from("blog_categories")
            .upsert({ blog_id: data.id, category_id: catId }, { onConflict: 'blog_id,category_id' }); // Assuming composite key or just insert
           
           if (mapError) console.error(`Failed to map category for ${blog.title}`, mapError);
        }
        results.push({ title: blog.title, status: "success" });
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (err) {
    console.error("SEED BLOGS ERROR:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { formatItinerary } from "@/lib/formatItinerary";
import LeadModal from "@/components/LeadModal";
import { Download, Copy, Share2, Lock, Unlock, Calendar, MapPin, Users, Phone, Mail, Star, TrendingUp, CheckCircle } from "lucide-react";

export default function ItineraryPage() {
  const router = useRouter();

  const [itinerary, setItinerary] = useState("");
  const [partialHtml, setPartialHtml] = useState("");
  const [fullHtml, setFullHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const [provider, setProvider] = useState(null);

  const [showFull, setShowFull] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const printRef = useRef(null);
  const autoPopupShown = useRef(false);

  // Contact form state
 const [contactForm, setContactForm] = useState({
  name: "",
  email: "",
  phone: "",
  destination: "",
  message: ""
});


  // Load itinerary
  useEffect(() => {
    const saved = localStorage.getItem("trip_data");

    if (!saved) {
      setPartialHtml("");
      setFullHtml("<p class='text-red-600'>No itinerary found.</p>");
      return;
    }

    setItinerary(saved);
    setProvider(localStorage.getItem("trip_provider") || "gemini");

    const formatted = formatItinerary(saved);

    const plain = formatted.replace(/<[^>]+>/g, "");
    const cutIndex = Math.floor(plain.length * 0.3);

    let visibleHTML = "";
    let hiddenHTML = "";
    let count = 0;

    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i];
      visibleHTML += char;

      if (!char.match(/<[^>]+>/)) count++;

      if (count >= cutIndex) {
        hiddenHTML = formatted.slice(i + 1);
        break;
      }
    }

    setPartialHtml(visibleHTML);
    setFullHtml(visibleHTML + hiddenHTML);
  }, []);

  // AUTO POPUP after 9 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showFull && !autoPopupShown.current) {
        autoPopupShown.current = true;
        setModalOpen(true);
      }
    }, 9000);

    return () => clearTimeout(timer);
  }, [showFull]);

  // PDF Download
  async function handleDownloadPDF() {
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf")
      ]);

      const element = document.getElementById("pdfContent");
      if (!element) {
        alert("PDF content not found");
        return;
      }

      const prevDisplay = element.style.display;
      element.style.display = "block";

      const imgs = element.querySelectorAll("img");
      await Promise.all(Array.from(imgs).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((res) => { img.onload = img.onerror = res; });
      }));

      const scale = 2;
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF({
        unit: "pt",
        format: "a4",
        orientation: "portrait"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = pageWidth / imgWidth;
      const renderedHeight = imgHeight * ratio;

      if (renderedHeight <= pageHeight) {
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, renderedHeight);
      } else {
        let remainingHeight = imgHeight;
        let position = 0;
        const pxPerPt = canvas.width / pageWidth;

        while (remainingHeight > 0) {
          const pageCanvas = document.createElement("canvas");
          const pageCtx = pageCanvas.getContext("2d");

          const pagePixelHeight = Math.floor(pageHeight * pxPerPt);
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(pagePixelHeight, remainingHeight);

          pageCtx.drawImage(
            canvas,
            0, position,
            canvas.width, pageCanvas.height,
            0, 0,
            pageCanvas.width, pageCanvas.height
          );

          const pageData = pageCanvas.toDataURL("image/jpeg", 1.0);
          const pageRenderedHeight = pageCanvas.height * ratio;

          if (pdf.getNumberOfPages() > 0) pdf.addPage();
          pdf.addImage(pageData, "JPEG", 0, 0, pageWidth, pageRenderedHeight);

          remainingHeight -= pageCanvas.height;
          position += pageCanvas.height;
        }
      }

      pdf.save("TripLinkers-Itinerary.pdf");
      element.style.display = prevDisplay || "none";
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("PDF generation failed, check console for details");
    }
  }

  // Copy Text
  async function handleCopyText() {
    try {
      await navigator.clipboard.writeText(itinerary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }

  // Share
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "TripLinkers Itinerary",
          text: "Check out this TripLinkers AI itinerary",
          url: window.location.href
        });
      } catch (e) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyText();
    }
  }

  // Handle contact form
const handleContactSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      destination: contactForm.destination,
      message: contactForm.message,
    };

    // 1️⃣ EMAIL
    const emailRes = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
        subject: "New Custom Quote Request - TripLinkers",
        from_name: "TripLinkers Website",
        ...payload,
      }),
    });

    const emailJson = await emailRes.json();
    if (!emailJson.success) throw new Error("Email failed");

    // 2️⃣ DASHBOARD SAVE
    const apiRes = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...payload,
        source: "Itinerary Page - Get Custom Quote",
      }),
    });

    const apiJson = await apiRes.json();
    if (!apiRes.ok || !apiJson.success) {
      throw new Error(apiJson.message || "Lead save failed");
    }

    alert("Thank you! Our team will contact you shortly.");

    setContactForm({
      name: "",
      email: "",
      phone: "",
      destination: "",
      message: "",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    alert("Submission failed. Please try again.");
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      
      {/* HIDDEN PDF TEMPLATE */}
      <div
        id="pdfContent"
        style={{ display: "none", padding: 24, background: "#ffffff", color: "#222" }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `4px solid #ff6900`,
          paddingBottom: 12,
          marginBottom: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/images/logo/triplinkers-svg.svg"
              width={120}
              alt="TripLinkers"
              style={{ display: "block" }}
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>
                TripLinkers Travel Itinerary
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>
                AI-powered custom travel planning
              </div>
            </div>
          </div>

            <div style={{ textAlign: "right", fontSize: 12, color: "#666" }}>
            <div>Generated by TripLinkers AI ({provider === "groq" ? "Groq" : "Gemini"})</div>
            <div>{new Date().toLocaleString()}</div>
          </div>
        </div>

        <div style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-25deg)",
          fontSize: 80,
          color: "#ff6900",
          opacity: 0.06,
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap"
        }}>
          TripLinkers
        </div>

        <div style={{ marginBottom: 12, fontSize: 13, color: "#333" }}>
          <strong>Summary:</strong>
          <div style={{ marginTop: 6 }}>
            {(() => {
              const plain = fullHtml ? fullHtml.replace(/<[^>]+>/g, "") : "";
              return plain ? `${plain.slice(0, 200)}${plain.length > 200 ? "…" : ""}` : "—";
            })()}
          </div>
        </div>

        <div style={{ fontSize: 12, color: "#222", lineHeight: 1.45 }} dangerouslySetInnerHTML={{ __html: fullHtml }} />

        <div style={{
          marginTop: 28,
          paddingTop: 12,
          borderTop: "1px solid #eee",
          color: "#666",
          fontSize: 12,
          textAlign: "center"
        }}>
          <div>Thank you for using TripLinkers</div>
          <div>www.triplinkers.com</div>
        </div>
      </div>

      {/* MODAL */}
      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setShowFull(true)}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Personalized Travel Itinerary
            </h1>
            <p className="text-xl text-orange-100">
              AI-powered custom travel planning designed just for you
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR - AdSense & Packages */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Google AdSense Hidden */}
            {/* <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
              <div className="text-gray-400 mb-2">
                <TrendingUp className="w-12 h-12 mx-auto mb-3" />
              </div>
              <p className="text-sm text-gray-500 font-semibold">Advertisement Space</p>
              <p className="text-xs text-gray-400 mt-1">Google AdSense</p>
            </div> */}

            {/* Popular Packages Hidden */}
            {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-600" />
                Popular Packages
              </h3>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg mb-3"></div>
                    <h4 className="font-bold text-gray-900 mb-1">Package {i}</h4>
                    <p className="text-sm text-gray-600 mb-2">Coming soon...</p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-bold">₹XX,XXX</span>
                      <span className="text-xs text-gray-500">X Days</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition-all">
                View All Packages
              </button>
            </div> */}

          </div>

          {/* CENTER - Itinerary Content */}
          <div className="lg:col-span-6">
              <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
                
                {/* Status Badge */}
                <div className="bg-gradient-to-r from-orange-100 to-orange-50 px-6 py-4 border-b border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {showFull ? (
                        <>
                          <Unlock className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700">Unlocked</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 text-orange-600" />
                          <span className="font-semibold text-orange-700">Preview Mode</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Attribution Badge */}
                {provider && (
                  <div className="bg-slate-50 border-t border-slate-100 px-6 py-2 flex justify-end">
                     <span className="text-[10px] items-center gap-1.5 flex uppercase tracking-wider font-bold text-slate-400">
                        ⚡ Powered by {provider === "groq" ? "Groq" : "Gemini"}
                     </span>
                  </div>
                )}

                {/* Content Area */}
                <div className="p-6 md:p-8">
                
                {!partialHtml ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No itinerary found.</p>
                    <button 
                      onClick={() => router.push("/")}
                      className="mt-4 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all"
                    >
                      Create New Itinerary
                    </button>
                  </div>
                ) : (
                  <div className="relative">

                    {/* VISIBLE TOP 30% */}
                    <div
                      className="prose prose-orange max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
                      dangerouslySetInnerHTML={{ __html: partialHtml }}
                    />

                    {/* LOCKED BLUR SECTION */}
                    {!showFull && (
                      <div className="relative mt-6">

                        <div
                          className="prose prose-orange max-w-none blur-md opacity-40 pointer-events-none select-none"
                          dangerouslySetInnerHTML={{
                            __html: fullHtml.replace(partialHtml, "")
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white"></div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                          <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md text-center border-2 border-orange-200">
                            <Lock className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                              Unlock Full Itinerary
                            </h3>
                            <p className="text-gray-600 mb-6">
                              Get complete access to your personalized travel plan with detailed day-by-day activities, timings, and recommendations.
                            </p>
                            <button
                              onClick={() => {
                                setModalOpen(true);
                                if (!autoPopupShown.current) autoPopupShown.current = true;
                              }}
                              className="w-full px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                            >
                              Unlock Now - Free
                            </button>
                            <p className="text-xs text-gray-500 mt-3">
                              No credit card required
                            </p>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* FULL UNLOCKED CONTENT */}
                    {showFull && (
                      <div
                        ref={printRef}
                        className="prose prose-orange max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 mt-6"
                        dangerouslySetInnerHTML={{ __html: fullHtml.replace(partialHtml, "") }}
                      />
                    )}

                  </div>
                )}

                {/* Action Buttons */}
                {partialHtml && (
                  <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleCopyText}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy"}
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>

                    <button
                      onClick={handleDownloadPDF}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - CTAs & Forms */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Quick Contact CTA */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 text-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-3">Need Help?</h3>
              <p className="text-orange-100 mb-4 text-sm">
                Our travel experts are ready to customize this itinerary for you!
              </p>
              <div className="space-y-3">
                <a href="tel:+915551234567" className="flex items-center gap-3 text-white hover:text-orange-100 transition-colors">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-orange-100">Call Us</div>
                    <div className="font-semibold">+91 555-123-4567</div>
                  </div>
                </a>
                <a href="mailto:info@triplinkers.com" className="flex items-center gap-3 text-white hover:text-orange-100 transition-colors">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-orange-100">Email Us</div>
                    <div className="font-semibold">info@triplinkers.com</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Custom Quote</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
  <input
    type="text"
    placeholder="Destination"
    value={contactForm.destination}
    onChange={(e) =>
      setContactForm({ ...contactForm, destination: e.target.value })
    }
    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    required
  />
</div>

                <div>
                  <textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Get Free Quote
                </button>
              </form>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
              <div className="space-y-3">
                {[
                  "Expert Travel Planners",
                  "24/7 Customer Support",
                  "Best Price Guarantee",
                  "10,000+ Happy Travelers"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </main>
  );
}
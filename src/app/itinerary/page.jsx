"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { formatItinerary } from "@/lib/formatItinerary";
// note: jsPDF and html2canvas are dynamically imported inside the download function to avoid SSR issues
import LeadModal from "@/components/LeadModal";

export default function ItineraryPage() {
  const router = useRouter();

  const [itinerary, setItinerary] = useState("");
  const [partialHtml, setPartialHtml] = useState("");
  const [fullHtml, setFullHtml] = useState("");
  const [copied, setCopied] = useState(false);

  const [showFull, setShowFull] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const printRef = useRef(null);
  const autoPopupShown = useRef(false);

  // Load itinerary
  useEffect(() => {
    const saved = localStorage.getItem("trip_data");

    if (!saved) {
      setPartialHtml("");
      setFullHtml("<p class='text-red-600'>No itinerary found.</p>");
      return;
    }

    setItinerary(saved);

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

  // PREMIUM PDF: dynamic import of html2canvas + jsPDF, watermark via HTML
  async function handleDownloadPDF() {
    try {
      // dynamic import to avoid SSR errors
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf")
      ]);

      const element = document.getElementById("pdfContent");
      if (!element) {
        alert("PDF content not found");
        return;
      }

      // Make pdfContent visible for capture
      const prevDisplay = element.style.display;
      element.style.display = "block";

      // ensure images are loaded (logo)
      const imgs = element.querySelectorAll("img");
      await Promise.all(Array.from(imgs).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((res) => { img.onload = img.onerror = res; });
      }));

      // scale for better quality
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

      // A4 sizes in px at 72 DPI: we'll work in points via jsPDF
      const pdf = new jsPDF({
        unit: "pt",
        format: "a4",
        orientation: "portrait"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // canvas size in px; convert to PDF points
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate ratio to fit page width
      const ratio = pageWidth / imgWidth;
      const renderedHeight = imgHeight * ratio;

      // If content fits in one page
      if (renderedHeight <= pageHeight) {
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, renderedHeight);
      } else {
        // Multi-page: slice canvas per page height
        let remainingHeight = imgHeight;
        let position = 0;
        const pxPerPt = canvas.width / pageWidth; // pixels per PDF point

        while (remainingHeight > 0) {
          const pageCanvas = document.createElement("canvas");
          const pageCtx = pageCanvas.getContext("2d");

          const pagePixelHeight = Math.floor(pageHeight * pxPerPt);
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(pagePixelHeight, remainingHeight);

          // draw slice
          pageCtx.drawImage(
            canvas,
            0, position, // source x,y
            canvas.width, pageCanvas.height, // source w,h
            0, 0, // dest
            pageCanvas.width, pageCanvas.height // dest w,h
          );

          const pageData = pageCanvas.toDataURL("image/jpeg", 1.0);
          const pageRenderedHeight = pageCanvas.height * ratio;

          if (pdf.getNumberOfPages() > 0) pdf.addPage();
          pdf.addImage(pageData, "JPEG", 0, 0, pageWidth, pageRenderedHeight);

          remainingHeight -= pageCanvas.height;
          position += pageCanvas.height;
        }
      }

      // Save file
      pdf.save("TripLinkers-Itinerary.pdf");

      // restore element display
      element.style.display = prevDisplay || "none";
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("PDF generation failed, check console for details");
    }
  }

  // COPY TEXT
  async function handleCopyText() {
    try {
      await navigator.clipboard.writeText(itinerary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }

  // SHARE API
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

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* HIDDEN PDF TEMPLATE (visible only when capturing) */}
      <div
        id="pdfContent"
        style={{ display: "none", padding: 24, background: "#ffffff", color: "#222" }}
      >
        {/* Header */}
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
            <div>Generated by TripLinkers</div>
            <div>{new Date().toLocaleString()}</div>
          </div>
        </div>

        {/* Watermark (center, faded) */}
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

        {/* Trip metadata (if you want to add more, insert below) */}
        <div style={{ marginBottom: 12, fontSize: 13, color: "#333" }}>
          {/* Try to extract some basic metadata if available */}
          {/* We'll attempt to show destination line if present in itinerary text */}
          <strong>Summary:</strong>
          <div style={{ marginTop: 6 }}>
            {/* First 200 chars of plain itinerary */}
            {(() => {
              const plain = fullHtml ? fullHtml.replace(/<[^>]+>/g, "") : "";
              return plain ? `${plain.slice(0, 200)}${plain.length > 200 ? "…" : ""}` : "—";
            })()}
          </div>
        </div>

        {/* The full itinerary HTML */}
        <div style={{ fontSize: 12, color: "#222", lineHeight: 1.45 }} dangerouslySetInnerHTML={{ __html: fullHtml }} />

        {/* Footer */}
        <div style={{
          marginTop: 28,
          paddingTop: 12,
          borderTop: "1px solid #eee",
          color: "#666",
          fontSize: 12,
          textAlign: "center"
        }}>
          <div>Thank you for using TripLinkers</div>
          <div>www.triplinkers.ai</div>
        </div>
      </div>

      {/* MODAL */}
      <LeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setShowFull(true)}
      />

      {/* MAIN CARD */}
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 border border-gray-200">

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Your Travel Itinerary
        </h1>

        {/* CONTENT */}
        {!partialHtml ? (
          <p className="text-gray-500">No itinerary found.</p>
        ) : (
          <div className="relative">

            {/* VISIBLE TOP 30% */}
            <div
              className="prose prose-gray max-w-none text-sm md:text-base leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: partialHtml }}
            />

            {/* LOCKED BLUR SECTION */}
            {!showFull && (
              <div className="relative">

                <div
                  className="prose prose-gray max-w-none text-sm md:text-base leading-relaxed blur-sm opacity-60 pointer-events-none"
                  dangerouslySetInnerHTML={{
                    __html: fullHtml.replace(partialHtml, "")
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>

                <div className="absolute top-2 left-0 right-0 flex justify-center z-50">
                  <button
                    onClick={() => {
                      setModalOpen(true);
                      if (!autoPopupShown.current) autoPopupShown.current = true;
                    }}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg"
                  >
                    Unlock Full Itinerary
                  </button>
                </div>

              </div>
            )}

            {/* FULL UNLOCKED CONTENT */}
            {showFull && (
              <div
                ref={printRef}
                className="prose prose-gray max-w-none text-sm md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: fullHtml }}
              />
            )}

          </div>
        )}

        {/* FINAL 3 BUTTONS ONLY (Always visible once showFull true or you can keep visible always) */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleCopyText}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
          >
            {copied ? "Copied!" : "Copy Text"}
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Share
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            Download PDF
          </button>
        </div>

      </div>
    </main>
  );
}

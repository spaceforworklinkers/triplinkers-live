export const metadata = {
  title: "Terms & Conditions | TripLinkers",
  description: "Review the terms and conditions for booking travel packages and services with TripLinkers.",
};

export default function Terms() {
  return (
    <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold text-teal-700 mb-8">
            Terms and Conditions
          </h1>

          <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing our website and using our services, you agree to be
                bound by these Terms and Conditions. If you do not agree with
                any part of these terms, you are prohibited from using this
                site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Booking and Reservations
              </h2>
              <p>
                All bookings are subject to availability. Prices are subject to
                change without notice until a booking is confirmed. A deposit
                may be required to secure your reservation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Cancellation Policy
              </h2>
              <p>
                Cancellations made within specific timeframes may be subject to
                fees. Refunds are processed according to the vendor's policy and
                our service agreement. Please review specific cancellation terms
                for each package.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Travel Documents
              </h2>
              <p>
                It is the responsibility of the traveler to ensure they possess
                valid travel documents, including passports and visas, required
                for entry into the UAE.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

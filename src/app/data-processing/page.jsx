export default function DataProcessing() {
  return (
    <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold text-teal-700 mb-8">
            How We Process Your Information
          </h1>

          <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Data Collection Purpose
              </h2>
              <p>
                We process your information primarily to facilitate your travel
                bookings, provide you with trip quotes, and improve our
                services. We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Third-Party Sharing
              </h2>
              <p>
                Your data may be shared with third-party service providers such
                as hotels, airlines, and tour operators strictly for the purpose
                of fulfilling your travel arrangements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Retention Period
              </h2>
              <p>
                We retain your personal information only for as long as is
                necessary for the purposes set out in this policy. We will
                retain and use your information to the extent necessary to
                comply with our legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Your Rights
              </h2>
              <p>
                You have the right to access, update, or delete the information
                we have on you. If you wish to exercise these rights, please
                contact us directly.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

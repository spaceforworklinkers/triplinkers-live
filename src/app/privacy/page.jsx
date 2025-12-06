export default function Privacy() {
  return (
    <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold text-teal-700 mb-8">Privacy Policy</h1>

          <div className="prose prose-slate max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Introduction</h2>
              <p>
                TripLinkers respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you including Identity Data such as your name, Contact Data such as email and phone, and Transaction Data such as payment details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we use your personal data to perform the contract we are about to enter into or have entered into with you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h2>
              <p>
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized manner.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

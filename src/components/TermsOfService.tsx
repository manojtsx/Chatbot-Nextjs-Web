import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#181824] py-16 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full border border-white/10 rounded-xl shadow-lg p-8 md:p-12 bg-[#23243a]">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-200">By accessing or using ManojAI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use our services.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">2. Use of Service</h2>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            <li>You must be at least 13 years old to use ManojAI.</li>
            <li>You agree not to misuse the service or help anyone else do so.</li>
            <li>You are responsible for your account and any activity under it.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">3. User Content</h2>
          <p className="text-gray-200">You retain ownership of any content you submit, but grant ManojAI a license to use, display, and process it to provide and improve our services. You are responsible for ensuring your content does not violate any laws or rights.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">4. Prohibited Conduct</h2>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            <li>No unlawful, harmful, or abusive use of ManojAI.</li>
            <li>No interference with or disruption of the service.</li>
            <li>No attempt to access or use accounts or data of others without permission.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">5. Termination</h2>
          <p className="text-gray-200">We reserve the right to suspend or terminate your access to ManojAI at any time, for any reason, including violation of these Terms.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">6. Disclaimers</h2>
          <p className="text-gray-200">ManojAI is provided "as is" and "as available" without warranties of any kind. We do not guarantee the accuracy, reliability, or availability of the service.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">7. Limitation of Liability</h2>
          <p className="text-gray-200">To the fullest extent permitted by law, ManojAI and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">8. Changes to Terms</h2>
          <p className="text-gray-200">We may update these Terms of Service from time to time. Continued use of ManojAI after changes means you accept the new terms.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-purple-300 mb-2">9. Contact Us</h2>
          <p className="text-gray-200">If you have any questions about these Terms, please contact us at <a href="mailto:info@manojai.com" className="text-purple-300 underline">info@manojai.com</a>.</p>
        </section>
      </div>
    </div>
  );
}

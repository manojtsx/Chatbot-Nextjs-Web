import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#181824] py-16 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full border border-white/10 rounded-xl shadow-lg p-8 md:p-12 bg-[#23243a]">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-10">Last updated: {new Date().toLocaleDateString()}</p>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">1. Introduction</h2>
          <p className="text-gray-200">ManojAI ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            <li>Personal Information: such as your name, email address, and contact details when you register or interact with our services.</li>
            <li>Usage Data: including information about how you use ManojAI, your device, and browser information.</li>
            <li>Cookies & Tracking: we use cookies and similar technologies to enhance your experience and analyze usage.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            <li>To provide, operate, and maintain our services.</li>
            <li>To improve, personalize, and expand our services.</li>
            <li>To communicate with you, including customer support and updates.</li>
            <li>To monitor and analyze usage and trends.</li>
            <li>To comply with legal obligations and protect our users.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">4. Information Sharing</h2>
          <p className="text-gray-200">We do not sell or rent your personal information. We may share information with trusted third parties who assist us in operating our services, as required by law, or to protect our rights.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">5. Data Security</h2>
          <p className="text-gray-200">We implement industry-standard security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">6. Your Rights</h2>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            <li>Access, update, or delete your personal information.</li>
            <li>Opt out of marketing communications.</li>
            <li>Request information about our data practices.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">7. Changes to This Policy</h2>
          <p className="text-gray-200">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-purple-300 mb-2">8. Contact Us</h2>
          <p className="text-gray-200">If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:info@manojai.com" className="text-purple-300 underline">info@manojai.com</a>.</p>
        </section>
      </div>
    </div>
  );
}

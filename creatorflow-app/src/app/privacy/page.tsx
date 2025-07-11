import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name and contact information</li>
                <li>Account credentials</li>
                <li>Profile information and preferences</li>
                <li>Communication history with our support team</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Communicate with you about products, services, offers, and events</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transfer or merger</li>
                <li>With trusted service providers who assist us in operating our website and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze how our website is used</li>
                <li>Provide personalized content and advertisements</li>
                <li>Improve our services and user experience</li>
              </ul>
              <p className="mb-4">
                You can control cookie settings through your browser preferences, though disabling cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="mb-4">
                Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
              </ul>
              <p className="mb-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="mb-4">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your personal information in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><strong>Email:</strong> privacy@creatorflow.com</p>
                <p className="mb-2"><strong>Address:</strong> CreatorFlow, Inc.</p>
                <p className="mb-2">123 Innovation Drive</p>
                <p>Tech City, TC 12345</p>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Last updated:</strong> January 2025
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
  const lastUpdated = "December 2024";

  return (
    <>
      <Head>
        <title>Terms of Service | Where Was It Filmed</title>
        <meta name="description" content="Terms of Service for Where Was It Filmed - Read our terms and conditions for using our website." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://wherewasitfilmed.co/terms" />
      </Head>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-primary mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {lastUpdated}</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your use of the Where Was It Filmed website 
                located at wherewasitfilmed.co (the "Service") operated by Where Was It Filmed ("us", "we", or "our").
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree 
                with any part of these terms, then you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Where Was It Filmed provides information about filming locations for movies and TV series, 
                including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Detailed guides to filming locations</li>
                <li>Interactive maps and geographical information</li>
                <li>Travel and tourism information</li>
                <li>Behind-the-scenes information</li>
                <li>User comments and community features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Accounts and Registration</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Some features of our Service may require you to create an account. When you create an account, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Content and Conduct</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Content Guidelines</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may submit comments, reviews, and other content. By submitting content, you agree that it:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Is accurate and not misleading</li>
                <li>Does not violate any laws or regulations</li>
                <li>Does not infringe on intellectual property rights</li>
                <li>Is not spam, offensive, or inappropriate</li>
                <li>Does not contain malicious code or links</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Prohibited Uses</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not use our Service to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violate any laws or regulations</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Transmit spam or unsolicited communications</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to scrape or download content</li>
                <li>Impersonate others or provide false information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Our Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by Where Was It Filmed 
                and are protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">User Content License</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                By submitting content to our Service, you grant us a worldwide, non-exclusive, royalty-free, 
                transferable license to use, reproduce, distribute, prepare derivative works of, display, 
                and perform your content in connection with the Service.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Fair Use</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our use of film and TV series information, images, and related content is protected under 
                fair use for educational and informational purposes. We respect intellectual property rights 
                and will respond to valid takedown notices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Advertising and Third-Party Links</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our Service may contain advertisements and links to third-party websites. We are not responsible 
                for the content or practices of these third parties. Your interactions with advertisers and 
                third-party websites are solely between you and such parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Please review our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, 
                which explains how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">Information Accuracy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                While we strive to provide accurate information about filming locations, we make no warranties 
                about the completeness, reliability, or accuracy of this information. Filming locations may 
                change, and access may be restricted.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Travel and Safety</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You are responsible for your own safety when visiting filming locations. We are not liable 
                for any injuries, damages, or losses that may occur during your travels.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">Service Availability</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not guarantee that our Service will be available at all times. We may experience 
                downtime for maintenance, updates, or technical issues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, Where Was It Filmed shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, or any loss of profits 
                or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, 
                or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Indemnification</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to defend, indemnify, and hold harmless Where Was It Filmed from and against 
                any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses 
                (including attorney's fees) arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without 
                prior notice, for any reason, including if you breach these Terms. Upon termination, 
                your right to use the Service will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any 
                material changes by posting the updated Terms on this page with a new "Last updated" date. 
                Your continued use of the Service after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Governing Law</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                in which Where Was It Filmed operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@wherewasitfilmed.co<br/>
                  <strong>Website:</strong> <Link href="/about" className="text-primary hover:underline">wherewasitfilmed.co/about</Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
} 
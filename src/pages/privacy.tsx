import React from 'react';
import SEO from '../components/SEO';
import { getWebPageSchema } from '../utils/schema';
import { useRouter } from 'next/router';

export default function Privacy() {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wherewasitfilmed.co';
  const currentUrl = `${BASE_URL}${router.asPath}`;

  // Create page metadata
  const pageMeta = {
    title: 'Privacy Policy - Where Was It Filmed',
    description: 'Learn how Where Was It Filmed collects, uses, and protects your personal information. Our commitment to your privacy and data security.',
    slug: 'privacy',
  };

  // Generate webpage schema
  const webpageSchema = getWebPageSchema(
    'Privacy Policy - Where Was It Filmed',
    'Learn how Where Was It Filmed collects, uses, and protects your personal information. Our commitment to your privacy and data security.',
    currentUrl
  );

  return (
    <>
      <SEO 
        meta={pageMeta}
        jsonLd={webpageSchema}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl opacity-90">
              Your privacy matters to us. Learn how we protect your data.
            </p>
            <p className="text-sm opacity-75 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
              
              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
                <p className="text-gray-600 mb-4">
                  Welcome to Where Was It Filmed ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://wherewasitfilmed.co" className="text-primary hover:underline">wherewasitfilmed.co</a> and use our services.
                </p>
                <p className="text-gray-600">
                  By using our website, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, please do not use our website.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Personal Information</h3>
                <p className="text-gray-600 mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Subscribe to our newsletter</li>
                  <li>Leave comments on our articles</li>
                  <li>Contact us through our contact forms</li>
                  <li>Participate in surveys or promotions</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mb-3">Automatically Collected Information</h3>
                <p className="text-gray-600 mb-4">
                  When you visit our website, we automatically collect certain information about your device and usage patterns:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website</li>
                  <li>Device information (mobile, desktop, tablet)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mb-3">Cookies and Tracking Technologies</h3>
                <p className="text-gray-600 mb-4">
                  We use cookies, web beacons, and similar tracking technologies to enhance your browsing experience and analyze website traffic. These technologies help us:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Remember your preferences</li>
                  <li>Understand how you use our website</li>
                  <li>Improve our content and services</li>
                  <li>Provide personalized advertising</li>
                </ul>
              </section>

              {/* How We Use Your Information */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Providing and maintaining our website and services</li>
                  <li>Sending newsletters and promotional content (with your consent)</li>
                  <li>Responding to your comments, questions, and requests</li>
                  <li>Analyzing website usage and improving user experience</li>
                  <li>Detecting and preventing fraud or abuse</li>
                  <li>Complying with legal obligations</li>
                  <li>Personalizing content and advertisements</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Information Sharing and Disclosure</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Service Providers</h3>
                <p className="text-gray-600 mb-4">
                  We may share your information with trusted third-party service providers who assist us in operating our website, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Web hosting services (Vercel)</li>
                  <li>Analytics services (Google Analytics)</li>
                  <li>Email marketing services</li>
                  <li>Comment management systems</li>
                  <li>Advertising networks</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mb-3">Legal Requirements</h3>
                <p className="text-gray-600 mb-6">
                  We may disclose your information if required by law or in response to valid requests by public authorities, such as a court or government agency.
                </p>
              </section>

              {/* Data Security */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure hosting infrastructure</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Access controls and authentication</li>
                  <li>Data backup and recovery procedures</li>
                </ul>
                <p className="text-gray-600">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </section>

              {/* Your Rights */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Privacy Rights</h2>
                <p className="text-gray-600 mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
                </ul>
                <p className="text-gray-600">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </section>

              {/* Cookies Policy */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookies Policy</h2>
                <p className="text-gray-600 mb-4">
                  Our website uses cookies to enhance your browsing experience. You can control cookie settings through your browser preferences:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                  <li><strong>Advertising Cookies:</strong> Used to display relevant advertisements</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                <p className="text-gray-600">
                  You can disable cookies in your browser settings, but this may affect website functionality.
                </p>
              </section>

              {/* Third-Party Links */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Links</h2>
                <p className="text-gray-600">
                  Our website may contain links to third-party websites, including affiliate links and social media platforms. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.
                </p>
              </section>

              {/* Children's Privacy */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Children's Privacy</h2>
                <p className="text-gray-600">
                  Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              {/* International Transfers */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">International Data Transfers</h2>
                <p className="text-gray-600">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
                </p>
              </section>

              {/* Changes to Privacy Policy */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date. Your continued use of our website after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-600 mb-2">
                    <strong>Email:</strong> privacy@wherewasitfilmed.co
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Website:</strong> <a href="https://wherewasitfilmed.co" className="text-primary hover:underline">wherewasitfilmed.co</a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 30 days.
                  </p>
                </div>
              </section>

              {/* GDPR Compliance */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">GDPR Compliance</h2>
                <p className="text-gray-600 mb-4">
                  If you are a resident of the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Right to be informed about data collection and use</li>
                  <li>Right of access to your personal data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure ("right to be forgotten")</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Rights related to automated decision-making</li>
                </ul>
                <p className="text-gray-600">
                  To exercise these rights or file a complaint with a supervisory authority, please contact us using the information provided above.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
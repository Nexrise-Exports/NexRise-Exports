"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-4xl px-6 py-20"
      >
        <div className="mb-12">
          <h1 className="font-serif text-5xl md:text-6xl text-accent mb-4">Privacy Policy</h1>
          <p className="font-sans text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8 font-sans text-foreground">
          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to NexRise Spices. We are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-primary-foreground">Personal Information:</strong> Name, email address, phone number, and shipping address when you make a purchase or contact us.</li>
                <li><strong className="text-primary-foreground">Payment Information:</strong> Credit card details and billing information processed through secure payment gateways.</li>
                <li><strong className="text-primary-foreground">Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and browsing patterns.</li>
                <li><strong className="text-primary-foreground">Cookies:</strong> We use cookies to enhance your browsing experience and analyze website traffic.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">3. How We Use Your Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process and fulfill your orders</li>
                <li>To communicate with you about your orders, inquiries, and our services</li>
                <li>To improve our website and customer experience</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To comply with legal obligations and prevent fraud</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>With service providers who assist us in operating our website and conducting business</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">6. Your Rights</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">7. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website uses cookies to enhance user experience. You can control cookie preferences through your browser settings. 
              However, disabling cookies may limit certain functionalities of our website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">8. Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. 
              We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. 
              If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page 
              and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p><strong className="text-primary-foreground">Email:</strong> contact@nexriseexports.com</p>
              <p><strong className="text-primary-foreground">Phone:</strong> +91 95658 51852</p>
              <p><strong className="text-primary-foreground">Address:</strong> D 47/210 A Ramapura, Varanasi, Uttar Pradesh 221001, India</p>
            </div>
          </section>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}


"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <div className="bg-white min-h-screen py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-4xl px-6 py-20"
      >
        <div className="mb-12">
          <h1 className="font-serif text-5xl md:text-6xl text-accent mb-4">Terms and Conditions</h1>
          <p className="font-sans text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8 font-sans text-foreground">
          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the NexRise Spices website, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">2. Use License</h2>
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to temporarily download one copy of the materials on NexRise Spices' website for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">3. Products and Services</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We strive to provide accurate descriptions and images of our products. However, we do not warrant that product descriptions, 
                images, or other content on this site is accurate, complete, reliable, current, or error-free.
              </p>
              <p className="leading-relaxed">
                All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">4. Orders and Payment</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                When you place an order, you are making an offer to purchase products at the prices stated. We reserve the right to accept or reject any order.
              </p>
              <p className="leading-relaxed">
                Payment must be received before we ship your order. We accept various payment methods as displayed on our checkout page.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">5. Shipping and Delivery</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We ship products to the address you provide during checkout. Delivery times are estimates and may vary based on location and shipping method.
              </p>
              <p className="leading-relaxed">
                Risk of loss and title for products pass to you upon delivery to the carrier. You are responsible for filing any claims with carriers for damaged or lost shipments.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">6. Returns and Refunds</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                We accept returns within 30 days of delivery for unopened products in their original packaging. 
                To initiate a return, please contact us at heritage@nexrisespices.com.
              </p>
              <p className="leading-relaxed">
                Refunds will be processed to the original payment method within 7-10 business days after we receive and inspect the returned item.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of NexRise Spices or its content suppliers 
              and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              NexRise Spices shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">9. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless NexRise Spices, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, 
              and expenses arising out of your use of the website or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India. 
              Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts of Uttar Pradesh, India.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page 
              and updating the "Last updated" date. Your continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-accent mb-4">12. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us at:
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


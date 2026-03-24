import Footer from "@/components/footer";
import Navbar from "@/components/ui/navbar";

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <div className="flex-1 w-full px-6 md:px-16 py-10">
        <h1 className="text-2xl font-bold text-center mb-10 text-[#17b266]">
          Privacy Policy
        </h1>

        <p className="text-[#797B89] text-sm md:text-base mb-8">
          Welcome to <strong className="text-black">RENTAM360</strong>. Your privacy matters to us, and this Privacy
          Policy explains how we collect, use, disclose, and protect your information when you use our mobile
          application, website, and related services (collectively, the &quot;Service&quot;). By using RENTAM360, you agree to
          the practices described in this Privacy Policy.
        </p>

        <div className="space-y-8 max-w-4xl">

          <Section title="1. Information We Collect">
            <SubSection title="1.1 Personal Information">
              <p className="text-[#797B89] text-sm md:text-base mb-3">
                We may collect information that identifies you, including but not limited to:
              </p>
              <Items items={[
                "Full name",
                "Email address",
                "Phone number",
                "Billing and payment information",
                "Government-issued ID (where required for leasing verification)",
                "Company or business details (if applicable)",
              ]} />
            </SubSection>

            <SubSection title="1.2 Equipment & Transaction Information">
              <Items items={[
                "Equipment listings and rental history",
                "Lease duration, pricing, and agreements",
                "Delivery, pickup, and usage details",
              ]} />
            </SubSection>

            <SubSection title="1.3 Technical & Usage Data">
              <Items items={[
                "Device type, operating system, and app version",
                "IP address and approximate location",
                "Log data, analytics, and crash reports",
              ]} />
            </SubSection>

            <SubSection title="1.4 Location Data" last>
              <p className="text-[#797B89] text-sm md:text-base mb-3">
                We may collect location information (with your permission) to:
              </p>
              <Items items={[
                "Enable equipment delivery and pickup",
                "Verify service availability",
                "Improve platform functionality",
              ]} />
            </SubSection>
          </Section>

          <Section title="2. How We Use Your Information">
            <p className="text-[#797B89] text-sm md:text-base mb-3">We use your information to:</p>
            <Items items={[
              "Create and manage user accounts",
              "Facilitate equipment leasing and payments",
              "Verify identity and prevent fraud",
              "Communicate updates, confirmations, and support messages",
              "Improve app performance and user experience",
              "Comply with legal and regulatory requirements",
            ]} />
          </Section>

          <Section title="3. Sharing of Information">
            <p className="text-[#797B89] text-sm md:text-base mb-3">We may share your information with:</p>
            <Items items={[
              <><strong className="text-black">Service providers</strong> (payment processors, hosting, analytics, delivery partners)</>,
              <><strong className="text-black">Equipment owners and renters</strong> as required to complete a lease</>,
              <><strong className="text-black">Legal authorities</strong> when required by law or to protect our rights</>,
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              We do <strong className="text-black">not</strong> sell your personal information to third parties.
            </p>
          </Section>

          <Section title="4. Data Retention">
            <p className="text-[#797B89] text-sm md:text-base mb-3">
              We retain personal information only for as long as necessary to:
            </p>
            <Items items={[
              "Provide our services",
              "Fulfill legal and contractual obligations",
              "Resolve disputes and enforce agreements",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              When no longer needed, data is securely deleted or anonymized.
            </p>
          </Section>

          <Section title="5. Data Security">
            <p className="text-[#797B89] text-sm md:text-base">
              We implement reasonable administrative, technical, and physical safeguards to protect your data. However,
              no system is completely secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="6. Your Rights and Choices">
            <p className="text-[#797B89] text-sm md:text-base mb-3">
              Depending on your location, you may have the right to:
            </p>
            <Items items={[
              "Access your personal data",
              "Correct inaccurate information",
              "Request deletion of your data",
              "Withdraw consent for data processing",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              You can exercise these rights by contacting us at the email address below.
            </p>
          </Section>

          <Section title="7. Cookies and Tracking Technologies">
            <p className="text-[#797B89] text-sm md:text-base mb-3">
              RENTAM360 may use cookies and similar technologies to:
            </p>
            <Items items={[
              "Remember user preferences",
              "Analyze usage patterns",
              "Improve platform performance",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              You can manage cookie preferences through your device or browser settings.
            </p>
          </Section>

          <Section title="8. Third-Party Links">
            <p className="text-[#797B89] text-sm md:text-base">
              Our Service may contain links to third-party websites or services. We are not responsible for their
              privacy practices and encourage you to review their policies.
            </p>
          </Section>

          <Section title="9. Children&apos;s Privacy">
            <p className="text-[#797B89] text-sm md:text-base">
              RENTAM360 is not intended for individuals under the age of 18. We do not knowingly collect personal
              information from minors.
            </p>
          </Section>

          <Section title="10. Changes to This Privacy Policy">
            <p className="text-[#797B89] text-sm md:text-base">
              We may update this Privacy Policy from time to time. Changes will be posted within the app or on our
              website, and the &quot;Last Updated&quot; date will be revised accordingly.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p className="text-[#797B89] text-sm md:text-base mb-3">
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <p className="text-[#797B89] text-sm md:text-base font-semibold">RENTAM360</p>
            <p className="text-[#797B89] text-sm md:text-base">
              Email:{" "}
              <a href="mailto:support@rentam360.com" className="underline hover:text-[#17b266]">
                support@rentam360.com
              </a>
            </p>
          </Section>

          <p className="italic text-[#797B89] text-sm md:text-base pt-4 border-t border-gray-100">
            By using RENTAM360, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-black mb-3">{title}</h2>
      {children}
    </div>
  );
}

function SubSection({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={last ? "mb-0" : "mb-5"}>
      <h3 className="text-sm md:text-base font-semibold text-black mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Items({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start text-[#797B89] text-sm md:text-base">
          <span className="mt-[0.55em] h-[3px] w-[3px] shrink-0 rounded-full bg-[#797B89]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

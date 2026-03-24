import Footer from "@/components/footer";
import Navbar from "@/components/ui/navbar";

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col font-sans">
      <Navbar />

      <div className="flex-1 w-full px-6 md:px-16 py-10">
        <h1 className="text-2xl font-bold text-center mb-10">
          <span className="text-[#17b266]">Terms</span>{" "}
          <span className="text-black">&amp;</span>{" "}
          <span className="text-[#17b266]">Conditions</span>
        </h1>

        <p className="text-[#797B89] text-sm md:text-base mb-8">
          Welcome to <strong className="text-black">RENTAM360</strong>. These Terms and Conditions ("Terms") govern
          your access to and use of the RENTAM360 mobile application, website, and related services (collectively,
          the "Service"). By accessing or using RENTAM360, you agree to be bound by these Terms. If you do not agree,
          please do not use the Service.
        </p>

        <div className="space-y-8 max-w-4xl">

          <Section title="1. Definitions">
            <Items items={[
              <><strong className="text-black">&quot;RENTAM360,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;</strong> refers to the RENTAM360 platform and its operators.</>,
              <><strong className="text-black">&quot;User&quot;</strong> refers to any individual or entity that accesses or uses the Service.</>,
              <><strong className="text-black">&quot;Lessor&quot;</strong> refers to a user who lists equipment for lease.</>,
              <><strong className="text-black">&quot;Lessee&quot;</strong> refers to a user who leases equipment through the platform.</>,
              <><strong className="text-black">&quot;Equipment&quot;</strong> refers to tools, machinery, vehicles, or assets listed on RENTAM360.</>,
            ]} />
          </Section>

          <Section title="2. Eligibility">
            <p className="text-[#797B89] text-sm md:text-base mb-3">You must:</p>
            <Items items={[
              <>Be at least <strong className="text-black">18 years old</strong></>,
              "Have the legal authority to enter into binding contracts",
              "Provide accurate and complete registration information",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              We reserve the right to suspend or terminate accounts that do not meet these requirements.
            </p>
          </Section>

          <Section title="3. Account Registration and Security">
            <Items items={[
              "Users must create an account to access certain features",
              "You are responsible for maintaining account confidentiality",
              "You agree to notify us immediately of unauthorized account use",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              RENTAM360 is not liable for losses caused by unauthorized account access due to your failure to secure
              your credentials.
            </p>
          </Section>

          <Section title="4. Platform Role and Disclaimer">
            <p className="text-[#797B89] text-sm md:text-base mb-3">
              RENTAM360 is a <strong className="text-black">technology platform</strong> that facilitates equipment
              leasing between Lessors and Lessees.
            </p>
            <p className="text-[#797B89] text-sm md:text-base mb-3">We do <strong className="text-black">not</strong>:</p>
            <Items items={[
              "Own, inspect, or operate listed equipment",
              "Guarantee equipment condition, safety, or legality",
              "Act as a party to the lease agreement unless explicitly stated",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              All leasing agreements are entered into directly between Users.
            </p>
          </Section>

          <Section title="5. Equipment Listings">
            <p className="text-[#797B89] text-sm md:text-base mb-3">Lessors agree that:</p>
            <Items items={[
              "Equipment information is accurate and lawful",
              "They have the right to lease the listed equipment",
              "Listings do not violate third-party rights or laws",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              RENTAM360 reserves the right to remove or modify listings at its discretion.
            </p>
          </Section>

          <Section title="6. Leasing, Payments, and Fees">
            <Items items={[
              "Lease terms, pricing, and availability are set by the Lessor",
              "Payments must be made through approved payment methods",
              "Platform service fees may apply and will be disclosed prior to confirmation",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              Failure to pay may result in suspension or legal action.
            </p>
          </Section>

          <Section title="7. Security Deposits">
            <p className="text-[#797B89] text-sm md:text-base mb-3">Some leases may require a security deposit:</p>
            <Items items={[
              "Deposits may be held temporarily",
              "Deductions may be made for damage, loss, or late return",
              "Disputes will be handled according to our dispute resolution process",
            ]} />
          </Section>

          <Section title="8. Equipment Use and Responsibility">
            <p className="text-[#797B89] text-sm md:text-base mb-3">Lessees agree to:</p>
            <Items items={[
              "Use equipment only for lawful and intended purposes",
              "Follow manufacturer and safety guidelines",
              "Return equipment on time and in agreed condition",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              You are responsible for any loss, theft, misuse, or damage during the lease period.
            </p>
          </Section>

          <Section title="9. Cancellations and Refunds">
            <p className="text-[#797B89] text-sm md:text-base mb-3">Cancellation and refund policies:</p>
            <Items items={[
              "Are set by the Lessor unless otherwise stated",
              "May vary by equipment and lease type",
              "Platform fees may be non-refundable",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              RENTAM360 is not responsible for refund disputes between Users.
            </p>
          </Section>

          <Section title="10. Prohibited Conduct">
            <p className="text-[#797B89] text-sm md:text-base mb-3">You agree not to:</p>
            <Items items={[
              "Provide false or misleading information",
              "Circumvent payments outside the platform",
              "Damage, reverse-engineer, or misuse the Service",
              "Use the Service for illegal or fraudulent purposes",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              Violation may result in immediate account termination.
            </p>
          </Section>

          <Section title="11. Intellectual Property">
            <p className="text-[#797B89] text-sm md:text-base">
              All content, trademarks, logos, and software related to RENTAM360 are owned by or licensed to us. You
              may not copy, distribute, or exploit platform content without written permission.
            </p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p className="text-[#797B89] text-sm md:text-base mb-3">
              To the maximum extent permitted by law, RENTAM360 shall not be liable for:
            </p>
            <Items items={[
              "Indirect, incidental, or consequential damages",
              "Personal injury, property damage, or equipment failure",
              "Losses arising from user disputes or equipment use",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">Use of the Service is at your own risk.</p>
          </Section>

          <Section title="13. Indemnification">
            <p className="text-[#797B89] text-sm md:text-base mb-3">
              You agree to indemnify and hold harmless RENTAM360 from any claims, damages, losses, or expenses arising
              from:
            </p>
            <Items items={[
              "Your use of the Service",
              "Breach of these Terms",
              "Violation of laws or third-party rights",
            ]} />
          </Section>

          <Section title="14. Suspension and Termination">
            <p className="text-[#797B89] text-sm md:text-base mb-3">We may suspend or terminate your account:</p>
            <Items items={[
              "For violation of these Terms",
              "For suspected fraud or illegal activity",
              "To comply with legal obligations",
            ]} />
            <p className="text-[#797B89] text-sm md:text-base mt-3">
              Termination does not remove your financial obligations.
            </p>
          </Section>

          <Section title="15. Governing Law and Dispute Resolution">
            <p className="text-[#797B89] text-sm md:text-base mb-3">
              These Terms shall be governed by the laws of <strong className="text-black">Nigeria</strong>.
            </p>
            <p className="text-[#797B89] text-sm md:text-base mb-3">Any disputes shall be resolved through:</p>
            <Items items={[
              "Negotiation in good faith",
              "Arbitration or courts of competent jurisdiction, as applicable",
            ]} />
          </Section>

          <Section title="16. Changes to Terms">
            <p className="text-[#797B89] text-sm md:text-base">
              We may update these Terms at any time. Continued use of RENTAM360 after changes means you accept the
              updated Terms.
            </p>
          </Section>

          <Section title="17. Contact Information">
            <p className="text-[#797B89] text-sm md:text-base mb-3">
              For questions regarding these Terms, contact us:
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
            By using RENTAM360, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
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

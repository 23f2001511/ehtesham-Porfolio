import type { Metadata } from "next";
import PublicLayout from "@/components/shared/PublicLayout";
import ContactSection from "@/sections/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Ehtesham Aalam for full-stack development work and collaborations."
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <ContactSection />
    </PublicLayout>
  );
}

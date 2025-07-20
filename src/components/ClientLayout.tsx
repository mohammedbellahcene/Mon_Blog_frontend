"use client";
import Footer from "./Footer";
import PrivacyModal from "./PrivacyModal";
import CookieConsentBanner from "./CookieConsentBanner";
import LegalModal from "./LegalModal";
import ContactModal from "./ContactModal";
import { useState } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <>
      {children}
      <Footer
        onShowPrivacy={() => setPrivacyOpen(true)}
        onShowLegal={() => setLegalOpen(true)}
        onShowContact={() => setContactOpen(true)}
      />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <LegalModal open={legalOpen} onClose={() => setLegalOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <CookieConsentBanner onShowPrivacy={() => setPrivacyOpen(true)} />
    </>
  );
} 
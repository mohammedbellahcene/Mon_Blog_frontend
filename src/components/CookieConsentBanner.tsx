import React, { useEffect, useState } from "react";

interface CookieConsentBannerProps {
  onShowPrivacy: () => void;
}

const CONSENT_KEY = "cookie_consent";

export default function CookieConsentBanner({ onShowPrivacy }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const handleConsent = (value: "accepted" | "refused") => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-gray-100 px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 shadow-lg">
      <span className="text-sm">
        Ce site utilise des cookies pour améliorer votre expérience. <button className="underline hover:text-blue-300" onClick={onShowPrivacy}>En savoir plus</button>.
      </span>
      <div className="flex gap-2 mt-2 md:mt-0">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded" onClick={() => handleConsent("accepted")}>Accepter</button>
        <button className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded" onClick={() => handleConsent("refused")}>Refuser</button>
      </div>
    </div>
  );
} 
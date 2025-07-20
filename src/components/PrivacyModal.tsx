import React from "react";

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Politique de confidentialité</h2>
        <div className="text-gray-700 text-sm space-y-2 max-h-80 overflow-y-auto">
          <p>Nous respectons votre vie privée. Ce site collecte uniquement les données nécessaires à son bon fonctionnement. Aucune donnée personnelle n'est vendue ou partagée à des tiers sans votre consentement.</p>
          <p>Les cookies utilisés servent à améliorer votre expérience et à des fins statistiques anonymes. Vous pouvez à tout moment consulter cette politique ou modifier votre consentement.</p>
          <p>Pour toute question, contactez-nous via la page Contact.</p>
        </div>
      </div>
    </div>
  );
} 
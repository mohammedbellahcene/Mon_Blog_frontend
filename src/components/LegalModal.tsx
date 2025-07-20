import React from "react";

interface LegalModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LegalModal({ open, onClose }: LegalModalProps) {
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
        <h2 className="text-xl font-bold mb-4">Mentions légales</h2>
        <div className="text-gray-700 text-sm space-y-2 max-h-80 overflow-y-auto">
          <p><strong>Nom du site :</strong> Mon Blog</p>
          <p><strong>Éditeur :</strong> Nom Prénom, contact@exemple.com</p>
          <p><strong>Hébergeur :</strong> OVH, 2 rue Kellermann, 59100 Roubaix, France</p>
          <p>Ce site est un blog personnel. Pour toute question, utilisez la page Contact.</p>
        </div>
      </div>
    </div>
  );
} 
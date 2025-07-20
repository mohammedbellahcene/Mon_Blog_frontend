import React from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
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
        <h2 className="text-xl font-bold mb-4">Contact</h2>
        <div className="text-gray-700 text-sm space-y-2 max-h-80 overflow-y-auto">
          <p>Pour toute question ou demande, contactez-nous :</p>
          <p>Email : <a href="mailto:contact@exemple.com" className="text-blue-600 underline">contact@exemple.com</a></p>
          <p>Vous pouvez aussi nous écrire sur nos réseaux sociaux :</p>
          <ul className="list-disc list-inside">
            <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Twitter</a></li>
            <li><a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Facebook</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
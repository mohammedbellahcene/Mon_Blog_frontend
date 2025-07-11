import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import React, { useState } from 'react';

const sections = [
  { key: 'users', label: 'Utilisateurs' },
  { key: 'posts', label: 'Posts' },
  { key: 'comments', label: 'Commentaires' },
  { key: 'categories-themes', label: 'Catégories & Thèmes' },
  { key: 'stats', label: 'Statistiques' },
  { key: 'notifications', label: 'Notifications' },
];

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.roles?.includes('ROLE_ADMIN')) {
    redirect('/');
  }

  // Le dashboard admin existant
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-xl text-blue-600 border-b">
          Admin Dashboard
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.key}>
                <button
                  className={`w-full text-left px-6 py-2 rounded transition font-medium ${
                    'users' === section.key
                      ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  // L'état actif sera géré côté client (bonus possible)
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Sections placeholders */}
        <div>Bienvenue sur le dashboard d'administration !</div>
      </main>
    </div>
  );
} 
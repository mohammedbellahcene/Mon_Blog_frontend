"use client";
import React, { useState } from 'react';
import AdminUsers from './AdminUsers';
import AdminPosts from './AdminPosts';
import AdminComments from './AdminComments';
import AdminCategoriesThemes from './AdminCategoriesThemes';
import Statistics from '../app/admin/statistics/page';

const sections = [
  { key: 'users', label: 'Utilisateurs' },
  { key: 'posts', label: 'Posts' },
  { key: 'comments', label: 'Commentaires' },
  { key: 'categories-themes', label: 'Catégories & Thèmes' },
  { key: 'stats', label: 'Statistiques' },
  { key: 'notifications', label: 'Notifications' },
];

export default function AdminDashboardClient() {
  const [active, setActive] = useState('users');
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
                    active === section.key
                      ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setActive(section.key)}
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
        {active === 'users' && <AdminUsers />}
        {active === 'posts' && <AdminPosts />}
        {active === 'comments' && <AdminComments />}
        {active === 'categories-themes' && <AdminCategoriesThemes />}
        {active === 'stats' && <Statistics />}
        {active === 'notifications' && <div>Notifications système (à implémenter)</div>}
      </main>
    </div>
  );
} 
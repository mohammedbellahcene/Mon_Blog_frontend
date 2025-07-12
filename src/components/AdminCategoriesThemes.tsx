import React from 'react';
import useSWR from 'swr';
import { api } from '../lib/api';

export default function AdminCategoriesThemes() {
  const fetcher = (url: string) => api.get(url).then(res => res.data);
  const { data: categories, error: catError } = useSWR('/api/admin/categories', fetcher);
  const { data: themes, error: themeError } = useSWR('/api/admin/themes', fetcher);

  const handleEdit = (id: number) => {
    alert(`Éditer ${id}`);
  };
  const handleDelete = (id: number) => {
    alert(`Supprimer ${id}`);
  };
  const handleAdd = () => {
    alert('Ajouter une catégorie ou un thème');
  };

  if (catError || themeError) return <div className="text-red-600">Erreur de chargement</div>;
  if (!categories || !themes) return <div>Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des catégories & thèmes</h2>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleAdd}>Ajouter</button>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Nom</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat: any) => (
            <tr key={`cat-${cat.id}`} className="text-center">
              <td className="border px-4 py-2">{cat.name}</td>
              <td className="border px-4 py-2">Catégorie</td>
              <td className="border px-4 py-2 space-x-2">
                <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onClick={() => handleEdit(cat.id)}>Éditer</button>
                <button className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200" onClick={() => handleDelete(cat.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
          {themes.map((theme: any) => (
            <tr key={`theme-${theme.id}`} className="text-center">
              <td className="border px-4 py-2">{theme.name}</td>
              <td className="border px-4 py-2">Thème</td>
              <td className="border px-4 py-2 space-x-2">
                <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onClick={() => handleEdit(theme.id)}>Éditer</button>
                <button className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200" onClick={() => handleDelete(theme.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
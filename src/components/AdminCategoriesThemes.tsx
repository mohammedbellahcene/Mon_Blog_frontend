import React from 'react';

// Données mockées pour l'exemple
const items = [
  { id: 1, name: 'Tech', type: 'Catégorie' },
  { id: 2, name: 'Lifestyle', type: 'Catégorie' },
  { id: 3, name: 'Sombre', type: 'Thème' },
];

export default function AdminCategoriesThemes() {
  const handleEdit = (id: number) => {
    alert(`Éditer ${id}`);
  };
  const handleDelete = (id: number) => {
    alert(`Supprimer ${id}`);
  };
  const handleAdd = () => {
    alert('Ajouter une catégorie ou un thème');
  };

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
          {items.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.type}</td>
              <td className="border px-4 py-2 space-x-2">
                <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onClick={() => handleEdit(item.id)}>Éditer</button>
                <button className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200" onClick={() => handleDelete(item.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
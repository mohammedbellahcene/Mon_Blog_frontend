import React from 'react';

// Données mockées pour l'exemple
const posts = [
  { id: 1, title: 'Premier post', author: 'alice', status: 'Publié', featured: false },
  { id: 2, title: 'Brouillon secret', author: 'bob', status: 'Brouillon', featured: false },
  { id: 3, title: 'Post en vedette', author: 'carol', status: 'Publié', featured: true },
];

export default function AdminPosts() {
  const handleEdit = (id: number) => {
    alert(`Éditer post ${id}`);
  };
  const handleFeature = (id: number) => {
    alert(`Mettre en avant post ${id}`);
  };
  const handleDelete = (id: number) => {
    alert(`Supprimer post ${id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des posts</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Titre</th>
            <th className="px-4 py-2 border">Auteur</th>
            <th className="px-4 py-2 border">Statut</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="text-center">
              <td className="border px-4 py-2">{post.title} {post.featured && <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">En vedette</span>}</td>
              <td className="border px-4 py-2">{post.author}</td>
              <td className="border px-4 py-2">{post.status}</td>
              <td className="border px-4 py-2 space-x-2">
                <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onClick={() => handleEdit(post.id)}>Éditer</button>
                <button className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200" onClick={() => handleFeature(post.id)}>{post.featured ? 'Retirer vedette' : 'Mettre en avant'}</button>
                <button className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200" onClick={() => handleDelete(post.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
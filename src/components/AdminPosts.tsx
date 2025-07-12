import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '../lib/api';

export default function AdminPosts() {
  const [page, setPage] = useState(0);
  const size = 10; // Nombre de posts par page

  const fetcher = async (url: string) => {
    const res = await api.get(url);
    return res.data;
  };
  const { data, error, isLoading } = useSWR(`/api/admin/posts?page=${page}&size=${size}`, fetcher);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">Erreur lors du chargement des posts.</div>;

  const posts = data?.content || [];
  const totalPages = data?.totalPages || 1;

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
          {posts.map((post: any) => (
            <tr key={post.id} className="text-center">
              <td className="border px-4 py-2">{post.title} {post.featured && <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">En vedette</span>}</td>
              <td className="border px-4 py-2">{post.author?.username || post.author || '-'}</td>
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
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Précédent
        </button>
        <span>Page {page + 1} / {totalPages}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page + 1 >= totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
} 
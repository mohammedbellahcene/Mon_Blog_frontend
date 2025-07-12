import React, { useState } from 'react';
import useSWR from 'swr';
import { api } from '../lib/api';

export default function AdminComments() {
  const [page, setPage] = useState(0);
  const size = 10;

  const fetcher = async (url: string) => {
    const res = await api.get(url);
    return res.data;
  };
  const { data, error, isLoading } = useSWR(`/api/admin/comments?page=${page}&size=${size}`, fetcher);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">Erreur lors du chargement des commentaires.</div>;

  const comments = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const handleValidate = (id: number) => {
    alert(`Valider commentaire ${id}`);
  };
  const handleDelete = (id: number) => {
    alert(`Supprimer commentaire ${id}`);
  };
  const handleReports = (id: number) => {
    alert(`Voir signalements pour commentaire ${id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Modération des commentaires</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Auteur</th>
            <th className="px-4 py-2 border">Contenu</th>
            <th className="px-4 py-2 border">Statut</th>
            <th className="px-4 py-2 border">Signalements</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment: any) => (
            <tr key={comment.id} className="text-center">
              <td className="border px-4 py-2">{comment.author?.username || '-'}</td>
              <td className="border px-4 py-2">{comment.content}</td>
              <td className="border px-4 py-2">{comment.status}</td>
              <td className="border px-4 py-2">{comment.reportCount}</td>
              <td className="border px-4 py-2 space-x-2">
                <button className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200" onClick={() => handleValidate(comment.id)}>Valider</button>
                <button className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200" onClick={() => handleDelete(comment.id)}>Supprimer</button>
                <button className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200" onClick={() => handleReports(comment.id)}>Voir signalements</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Précédent
        </button>
        <span>
          Page {page + 1} / {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page + 1 >= totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
} 
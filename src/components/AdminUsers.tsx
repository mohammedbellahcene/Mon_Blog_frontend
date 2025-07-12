import React from 'react';
import useSWR, { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import { api } from '../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const fetcher = async () => {
  const res = await api.get('/api/admin/users');
  return res.data;
};

interface UserResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const shouldFetch = !!token;
  const swrKey = shouldFetch ? [`${API_URL}/api/admin/users`, token] : null;
  const { data, error, isLoading } = useSWR<{ content: UserResponse[] }>(
    shouldFetch ? '/api/admin/users' : null,
    fetcher
  );

  if (!token) return <div>Authentification requise…</div>;
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">Erreur lors du chargement des utilisateurs.</div>;

  const users = data?.content || [];

  const handleToggle = (id: number) => {
    alert(`Activer/désactiver user ${id}`);
  };
  const handleRole = (id: number) => {
    alert(`Changer rôle user ${id}`);
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Confirmer la suppression de l'utilisateur ?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      // Rafraîchir la liste
      mutate(swrKey);
    } catch (e) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Nom</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Rôles</th>
            <th className="px-4 py-2 border">Statut</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.roles.join(', ')}</td>
              <td className="border px-4 py-2">
                {user.enabled ? (
                  <span className="text-green-600 font-semibold">Actif</span>
                ) : (
                  <span className="text-red-600 font-semibold">Désactivé</span>
                )}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                  onClick={() => handleToggle(user.id)}
                >
                  {user.enabled ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  onClick={() => handleRole(user.id)}
                >
                  Changer rôle
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                  onClick={() => handleDelete(user.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
import React from 'react';

// Données mockées pour l'exemple
const comments = [
  { id: 1, author: 'alice', content: 'Super article !', status: 'En attente', reports: 0 },
  { id: 2, author: 'bob', content: 'Je ne suis pas d’accord', status: 'Validé', reports: 2 },
  { id: 3, author: 'carol', content: 'Spam', status: 'Signalé', reports: 5 },
];

export default function AdminComments() {
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
          {comments.map((comment) => (
            <tr key={comment.id} className="text-center">
              <td className="border px-4 py-2">{comment.author}</td>
              <td className="border px-4 py-2">{comment.content}</td>
              <td className="border px-4 py-2">{comment.status}</td>
              <td className="border px-4 py-2">{comment.reports}</td>
              <td className="border px-4 py-2 space-x-2">
                <button className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200" onClick={() => handleValidate(comment.id)}>Valider</button>
                <button className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200" onClick={() => handleDelete(comment.id)}>Supprimer</button>
                <button className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200" onClick={() => handleReports(comment.id)}>Voir signalements</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
import useSWR from 'swr';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Erreur lors du chargement des statistiques');
  return res.json();
};

export default function StatisticsPage() {
  const { data, error, isLoading } = useSWR(
    `${API_URL}/api/admin/statistics/global`,
    fetcher
  );

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">Erreur lors du chargement des statistiques.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Statistiques globales</h2>
      <ul className="space-y-2">
        <li>Utilisateurs : {data?.totalUsers}</li>
        <li>Posts : {data?.totalPosts}</li>
        <li>Commentaires : {data?.totalComments}</li>
        <li>Nouveaux utilisateurs (30j) : {data?.newUsersLast30Days}</li>
        <li>Nouveaux posts (30j) : {data?.newPostsLast30Days}</li>
      </ul>
    </div>
  );
} 
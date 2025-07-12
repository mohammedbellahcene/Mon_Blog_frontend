import useSWR from 'swr';
import { useSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const fetcher = (url: string, token: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  }).then(res => {
    if (!res.ok) throw new Error('Erreur lors du chargement des statistiques');
    return res.json();
  });

export default function StatisticsPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const shouldFetch = !!token;
  const { data, error, isLoading } = useSWR(
    shouldFetch ? [`${API_URL}/api/admin/statistics/global`, token] : null,
    ([url, token]) => fetcher(url, token)
  );
  const { data: topPosts, error: errorTop, isLoading: loadingTop } = useSWR(
    shouldFetch ? [`${API_URL}/api/admin/statistics/top-posts`, token] : null,
    ([url, token]) => fetcher(url, token)
  );

  if (!token) return <div>Authentification requise…</div>;
  if (isLoading || loadingTop) return <div>Chargement...</div>;
  if (error || errorTop) return <div className="text-red-600">Erreur lors du chargement des statistiques.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Statistiques globales</h2>
      <ul className="space-y-2 mb-8">
        <li>Utilisateurs : {data?.totalUsers}</li>
        <li>Posts : {data?.totalPosts}</li>
        <li>Commentaires : {data?.totalComments}</li>
        <li>Nouveaux utilisateurs (30j) : {data?.newUsersLast30Days}</li>
        <li>Nouveaux posts (30j) : {data?.newPostsLast30Days}</li>
      </ul>

      <h3 className="text-xl font-semibold mt-8 mb-2">Top 5 posts les plus vus</h3>
      <ol className="list-decimal ml-6 mb-6">
        {topPosts?.mostViewed?.map((post: any) => (
          <li key={post.id}>
            {post.title} <span className="text-gray-500">({post.viewCount} vues)</span>
          </li>
        ))}
      </ol>

      <h3 className="text-xl font-semibold mb-2">Top 5 posts les plus commentés</h3>
      <ol className="list-decimal ml-6 mb-6">
        {topPosts?.mostCommented?.map((post: any) => (
          <li key={post.id}>
            {post.title} <span className="text-gray-500">({post.commentCount} commentaires)</span>
          </li>
        ))}
      </ol>

      <h3 className="text-xl font-semibold mb-2">Top 5 posts les plus likés</h3>
      <ol className="list-decimal ml-6 mb-6">
        {topPosts?.mostLiked?.map((post: any) => (
          <li key={post.id}>
            {post.title} <span className="text-gray-500">({post.likeCount} likes)</span>
          </li>
        ))}
      </ol>

      <h3 className="text-xl font-semibold mb-2">Top 5 posts les plus dislikés</h3>
      <ol className="list-decimal ml-6 mb-6">
        {topPosts?.mostDisliked?.map((post: any) => (
          <li key={post.id}>
            {post.title} <span className="text-gray-500">({post.dislikeCount} dislikes)</span>
          </li>
        ))}
      </ol>
    </div>
  );
} 
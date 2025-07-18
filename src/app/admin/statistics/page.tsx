"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Eye,
  Heart,
  ThumbsDown,
  Activity,
  Calendar,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const fetcher = (url: string, token: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  }).then((res) => {
    if (!res.ok) throw new Error("Erreur lors du chargement des statistiques");
    return res.json();
  });

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) {
  return (
    <div className={`flex items-center gap-4 p-6 rounded-xl border bg-white shadow hover:shadow-lg transition-all duration-200`}> 
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-gray-500 text-sm font-medium">{title}</div>
      </div>
    </div>
  );
}

function TopPostsList({ title, posts, icon: Icon, color, metric }: { title: string; posts: any[]; icon: any; color: string; metric: string }) {
  return (
    <div className="bg-white rounded-xl border shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 text-${color}-600`} />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <ol className="space-y-2">
        {posts?.length === 0 && <li className="text-gray-400 text-sm">Aucun résultat</li>}
        {posts?.map((post, i) => (
          <li key={post.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
            <span className="truncate max-w-xs font-medium">{i + 1}. {post.title}</span>
            <span className={`text-${color}-700 font-bold`}>{post[metric]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
      <span className="text-gray-500">Chargement des statistiques...</span>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <AlertCircle className="w-10 h-10 text-red-600 mb-2" />
      <span className="text-red-600 font-medium">{message}</span>
    </div>
  );
}

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

  if (!token) {
    return <ErrorMessage message="Authentification requise pour accéder aux statistiques" />;
  }
  if (isLoading || loadingTop) return <LoadingSpinner />;
  if (error || errorTop) return <ErrorMessage message="Erreur lors du chargement des statistiques" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-2">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          </div>
          <p className="text-gray-600">Vue d'ensemble de l'activité de votre blog</p>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Utilisateurs" value={data?.totalUsers || 0} icon={Users} color="blue" />
          <StatCard title="Articles publiés" value={data?.totalPosts || 0} icon={FileText} color="green" />
          <StatCard title="Commentaires" value={data?.totalComments || 0} icon={MessageSquare} color="purple" />
          <StatCard title="Nouveaux (30j)" value={data?.newUsersLast30Days || 0} icon={Activity} color="orange" />
        </div>

        {/* Détails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border shadow">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Activité récente (30 jours)</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-blue-50 rounded px-3 py-2">
                <span className="font-medium">Nouveaux utilisateurs</span>
                <span className="text-blue-700 font-bold">{data?.newUsersLast30Days || 0}</span>
              </div>
              <div className="flex justify-between items-center bg-green-50 rounded px-3 py-2">
                <span className="font-medium">Nouveaux articles</span>
                <span className="text-green-700 font-bold">{data?.newPostsLast30Days || 0}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Tendances</h3>
            </div>
            <div className="space-y-3 text-gray-500 text-sm">
              <div className="flex justify-between items-center">
                <span>Taux de croissance</span>
                <span className="font-bold text-green-600">+12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Engagement moyen</span>
                <span className="font-bold text-blue-600">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Temps de lecture</span>
                <span className="font-bold text-purple-600">3 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TopPostsList title="Articles les plus vus" posts={topPosts?.mostViewed || []} icon={Eye} color="blue" metric="viewCount" />
          <TopPostsList title="Articles les plus commentés" posts={topPosts?.mostCommented || []} icon={MessageSquare} color="green" metric="commentCount" />
          <TopPostsList title="Articles les plus aimés" posts={topPosts?.mostLiked || []} icon={Heart} color="red" metric="likeCount" />
          <TopPostsList title="Articles les plus controversés" posts={topPosts?.mostDisliked || []} icon={ThumbsDown} color="orange" metric="dislikeCount" />
        </div>
      </div>
    </div>
  );
} 
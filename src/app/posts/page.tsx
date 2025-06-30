'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { posts } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function PostsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [postsList, setPostsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data } = await posts.getAll();
        setPostsList(data.content || data);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        setPostsList([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleDelete = async (postId: number, postTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'article "${postTitle}" ?`)) {
      return;
    }

    try {
      setDeletingIds(prev => new Set(prev).add(postId));
      await posts.delete(postId);
      setPostsList(prev => prev.filter(post => post.id !== postId));
      toast.success('Article supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'article');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const isAuthor = (post: any) => session?.username === post.author.username;

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link
          href="/posts/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nouvel article
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {postsList.map((post: any) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            {post.featuredImage && (
              <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={e => { e.currentTarget.src = '/placeholder-image.png'; }}
                />
              </div>
            )}
            <Link href={`/posts/${post.id}`} className="block p-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  {post.theme.name}
                </span>
                <time>
                  {format(new Date(post.createdAt), 'PPP', { locale: fr })}
                </time>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${post.author.username}`}
                    alt={post.author.username}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {post.author.username}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
            
            {/* Boutons d'action pour l'auteur */}
            {isAuthor(post) && (
              <div className="px-6 pb-6 flex gap-2">
                <button
                  onClick={() => router.push(`/posts/${post.id}/edit`)}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  disabled={deletingIds.has(post.id)}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deletingIds.has(post.id) ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
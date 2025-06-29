'use client';

import { Suspense, useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { useSession } from 'next-auth/react';
import { posts } from '@/lib/api';
import CommentSection from '@/components/CommentSection';
import { toast } from 'react-hot-toast';

interface PostPageProps {
  params: { id: string };
}

export default function PostPage({ params }: PostPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger l'article au montage du composant
  useEffect(() => {
    const loadPost = async () => {
      try {
        const { data } = await posts.getById(params.id);
        setPost(data);
      } catch (error) {
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    loadPost();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await posts.delete(post.id);
      toast.success('Article supprimé avec succès');
      router.push('/posts');
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'article');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/posts/${post.id}/edit`);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  }

  if (!post) {
    return notFound();
  }

  // Vérifier si l'utilisateur connecté est l'auteur de l'article
  const isAuthor = session?.username === post.author.username;
  // TODO: Ajouter la vérification des rôles admin quand les rôles seront disponibles dans la session
  const canEdit = isAuthor;

  return (
    <article className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              {post.theme.name}
            </span>
            <time>
              {format(new Date(post.createdAt), 'PPP', { locale: fr })}
            </time>
          </div>
          
          {/* Boutons d'action pour l'auteur */}
          {canEdit && (
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Modifier
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          )}
        </div>
        
        <h1 className="mt-4 text-4xl font-bold text-gray-900">{post.title}</h1>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src={`https://ui-avatars.com/api/?name=${post.author.username}`}
              alt={post.author.username}
              className="h-8 w-8 rounded-full"
            />
            <span className="font-medium text-gray-900">
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
      </header>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <hr className="my-8" />

      <Suspense fallback={<div>Chargement des commentaires...</div>}>
        <CommentSection postId={post.id} />
      </Suspense>
    </article>
  );
} 
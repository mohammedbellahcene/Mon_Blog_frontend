'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CommentSection from '@/components/CommentSection';
import { deletePost } from '@/lib/api';
import ReactionButtons from '@/components/ReactionButtons';

type PostDetailProps = {
  post: any;
};

export default function PostDetail({ post }: PostDetailProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  const canEdit = session?.user?.email === post?.author?.email;

  const handleEdit = () => {
    router.push(`/posts/${post.id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      router.push('/');
      router.refresh();
      return;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert("Erreur lors de la suppression de l'article");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="container mx-auto px-4 py-8">
      {post.featuredImage && (
        <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

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
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          )}
        </div>

        <h1 className="mt-4 text-4xl font-bold text-gray-900">{post.title}</h1>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={`https://ui-avatars.com/api/?name=${post.author.username}`}
                alt={post.author.username}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <span className="font-medium text-gray-900">{post.author.username}</span>
                <div className="text-sm text-gray-500">
                  <span>{post.viewCount} vues</span>
                </div>
              </div>
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
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <div className="my-8">
        <ReactionButtons
          postId={post.id}
          initialLikes={post.likeCount}
          initialDislikes={post.dislikeCount}
        />
      </div>

      <hr className="my-8" />

      <Suspense fallback={<div>Chargement des commentaires...</div>}>
        <CommentSection postId={post.id} />
      </Suspense>
    </article>
  );
} 
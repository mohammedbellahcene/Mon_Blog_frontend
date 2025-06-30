'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { comments } from '@/lib/api';
import type { Comment } from '@/types/api';
import { toast } from 'react-hot-toast';

interface CommentSectionProps {
  postId: number;
}

interface CommentFormData {
  content: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await comments.getByPost(postId);
        // Selon la structure de la réponse, adapte la ligne ci-dessous :
        setCommentList(response.data.content || response.data || []);
      } catch (error) {
        // Optionnel : afficher une erreur ou laisser vide
      }
    };
    fetchComments();
  }, [postId]);

  const onSubmit = async (data: CommentFormData) => {
    if (!session) {
      toast.error('Vous devez être connecté pour commenter');
      return;
    }

    try {
      setIsLoading(true);
      const response = await comments.create(postId, {
        content: data.content,
      });
      setCommentList((prev) => [response.data, ...prev]);
      reset();
      toast.success('Commentaire ajouté avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Commentaires</h2>

      {session && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="content" className="sr-only">
              Votre commentaire
            </label>
            <textarea
              id="content"
              rows={3}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Écrivez votre commentaire..."
              {...register('content', { required: true })}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">
                Le contenu est requis
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
          >
            {isLoading ? 'Envoi...' : 'Commenter'}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {commentList.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${comment.author.username}`}
                  alt={comment.author.username}
                  className="h-6 w-6 rounded-full"
                />
                <span className="font-medium text-gray-900">
                  {comment.author.username}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </span>
              </div>
              {comment.status === 'PENDING' && (
                <span className="text-sm text-yellow-600">En attente de modération</span>
              )}
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { reactions } from '@/lib/api';
import { toast } from 'react-hot-toast';

// Idéalement, importer les icônes depuis une bibliothèque comme react-icons
const ThumbsUpIcon = () => <span>👍</span>;
const ThumbsDownIcon = () => <span>👎</span>;

interface ReactionButtonsProps {
  postId: number;
  initialLikes: number;
  initialDislikes: number;
}

export default function ReactionButtons({ postId, initialLikes, initialDislikes }: ReactionButtonsProps) {
  const { data: session, status } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState<'LIKE' | 'DISLIKE' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      reactions.getUserReaction(postId)
        .then(response => {
          if (response.data) {
            setUserReaction(response.data.type);
          }
        })
        .catch(() => {
          // L'utilisateur n'a pas encore réagi, c'est normal
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [postId, status]);

  const handleReaction = async (newReaction: 'LIKE' | 'DISLIKE') => {
    if (status !== 'authenticated') {
      toast.error('Vous devez être connecté pour réagir.');
      return;
    }

    if (userReaction === newReaction) {
      // L'utilisateur annule sa réaction
      try {
        await reactions.delete(postId);
        setUserReaction(null);
        if (newReaction === 'LIKE') setLikes(prev => prev - 1);
        else setDislikes(prev => prev - 1);
      } catch (error) {
        toast.error('Erreur lors de l\'annulation de la réaction.');
      }
    } else {
      // L'utilisateur ajoute ou change sa réaction
      try {
        await reactions.add(postId, newReaction);
        // Mise à jour des compteurs
        if (userReaction === 'LIKE') setLikes(prev => prev - 1);
        if (userReaction === 'DISLIKE') setDislikes(prev => prev - 1);
        if (newReaction === 'LIKE') setLikes(prev => prev + 1);
        if (newReaction === 'DISLIKE') setDislikes(prev => prev + 1);
        setUserReaction(newReaction);
      } catch (error) {
        toast.error('Erreur lors de l\'ajout de la réaction.');
      }
    }
  };

  const baseButtonClass = "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors";
  const likeButtonClass = userReaction === 'LIKE' ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
  const dislikeButtonClass = userReaction === 'DISLIKE' ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";

  if (isLoading) {
    return <div>Chargement des réactions...</div>
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleReaction('LIKE')}
        className={`${baseButtonClass} ${likeButtonClass}`}
      >
        <ThumbsUpIcon />
        <span>{likes}</span>
      </button>
      <button
        onClick={() => handleReaction('DISLIKE')}
        className={`${baseButtonClass} ${dislikeButtonClass}`}
      >
        <ThumbsDownIcon />
        <span>{dislikes}</span>
      </button>
    </div>
  );
} 
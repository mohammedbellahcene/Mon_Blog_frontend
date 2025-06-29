'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { posts, themes } from '@/lib/api';
import type { PostCreateRequest, PostStatus, Theme } from '@/types/api';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';

const postSchema = z.object({
  title: z.string()
    .min(3, 'Le titre doit faire au moins 3 caractères')
    .max(100, 'Le titre ne doit pas dépasser 100 caractères'),
  content: z.string()
    .min(100, 'Le contenu doit faire au moins 100 caractères'),
  themeId: z.string()
    .min(1, 'Le thème est requis'),
  tagsString: z.string().default(''),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED'] as const).default('DRAFT'),
  publishAt: z.string().optional().nullable()
});

type FormData = z.infer<typeof postSchema>;

export default function NewPostPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [themesList, setThemesList] = useState<Theme[]>([]);
  const [themesError, setThemesError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      status: 'DRAFT',
      tagsString: '',
    }
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const response = await themes.getAll();
        setThemesList(response.data);
      } catch (error) {
        setThemesError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemes();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImagePreview(e.target.value);
  };

  const onSubmit = async (data: FormData) => {
    console.log('Session username:', session?.username);
    if (!session?.username || session.username.includes('@')) {
      setError('root', {
        type: 'manual',
        message: "Erreur d'authentification: le username n'est pas correctement propagé. Veuillez vous reconnecter."
      });
      return;
    }

    console.log('Soumission du formulaire', data);
    try {
      if (!session?.accessToken) {
        setError('root', {
          type: 'manual',
          message: 'Vous devez être connecté pour créer un article'
        });
        return;
      }

      let featuredImage = '';
      // Si un fichier est sélectionné, upload
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('http://localhost:8080/api/files/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        featuredImage = result.url
          ? result.url
          : result.filename
            ? `http://localhost:8080/files/${result.filename}`
            : '';
        setUploading(false);
      } else if (imageUrl) {
        featuredImage = imageUrl;
      }

      const postData: any = {
        title: data.title,
        content: data.content,
        themeId: parseInt(data.themeId),
        status: data.status,
        featuredImage,
      };
      const tags = data.tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
      if (tags.length > 0) postData.tags = tags;
      if (data.status === 'SCHEDULED' && data.publishAt) postData.publishAt = data.publishAt;

      const response = await posts.create(postData);
      router.push(`/posts/${response.data.id}`);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError('root', { 
        type: 'manual',
        message: 'Erreur lors de la création de l\'article. Veuillez réessayer.'
      });
    } finally {
      setUploading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (themesError) {
    return (
      <div className="p-4">
        <div className="rounded-md bg-red-50 p-4">
          <h3 className="text-sm font-medium text-red-800">
            Erreur lors du chargement des thèmes
          </h3>
          <p className="mt-2 text-sm text-red-700">
            Veuillez rafraîchir la page ou réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      {errors.root && (
        <p className="mt-1 text-sm text-red-600">{errors.root.message}</p>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titre
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Contenu
        </label>
        <textarea
          id="content"
          rows={10}
          {...register('content')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="themeId" className="block text-sm font-medium text-gray-700">
          Thème
        </label>
        <select
          id="themeId"
          {...register('themeId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Sélectionnez un thème</option>
          {themesList.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
        {errors.themeId && (
          <p className="mt-1 text-sm text-red-600">{errors.themeId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="tagsString" className="block text-sm font-medium text-gray-700">
          Tags (séparés par des virgules)
        </label>
        <input
          type="text"
          id="tagsString"
          {...register('tagsString')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.tagsString && (
          <p className="mt-1 text-sm text-red-600">{errors.tagsString.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select
          id="status"
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="DRAFT">Brouillon</option>
          <option value="PUBLISHED">Publié</option>
          <option value="SCHEDULED">Planifié</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image principale</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="mt-1 block w-full"
        />
        <div className="mt-2 text-sm text-gray-500">Ou collez une URL d'image :</div>
        <input
          type="url"
          placeholder="https://..."
          value={imageUrl}
          onChange={handleImageUrlChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Aperçu" className="mt-2 max-h-48 rounded" />
        )}
        {uploading && <div className="text-blue-600 mt-2">Envoi de l'image...</div>}
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Créer l'article
      </button>
    </form>
  );
} 
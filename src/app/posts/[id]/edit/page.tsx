"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { posts, themes } from "@/lib/api";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const postSchema = z.object({
  title: z.string().min(5, "Le titre est requis"),
  content: z.string().min(100, "Le contenu doit faire au moins 100 caractères"),
  themeId: z.string(),
  tagsString: z.string().optional(),
  status: z.string().optional(),
});

type FormData = z.infer<typeof postSchema>;

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [themesList, setThemesList] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(postSchema),
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await posts.getById(params.id as string);
        setPost(data);
        setValue("title", data.title);
        setValue("content", data.content);
        setValue("themeId", data.theme.id.toString());
        setValue("tagsString", data.tags.join(", "));
        setValue("status", data.status);
        if (data.featuredImage) {
          setImagePreview(data.featuredImage);
          setImageUrl(data.featuredImage);
        }
        if (session?.username !== data.author.username) {
          setError("Vous n'êtes pas autorisé à modifier cet article.");
        }
      } catch (e) {
        setError("Article introuvable ou erreur serveur.");
      } finally {
        setLoading(false);
      }
    };
    const fetchThemes = async () => {
      try {
        const response = await themes.getAll();
        setThemesList(response.data);
      } catch (e) {
        setThemesList([]);
      }
    };
    fetchPost();
    fetchThemes();
  }, [params.id, session?.username, setValue]);

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

  const onSubmit = async (formData: FormData) => {
    if (!session?.accessToken) {
      toast.error("Vous devez être connecté");
      return;
    }
    try {
      let featuredImage = post?.featuredImage || '';
      // Si un fichier est sélectionné, upload
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        setUploading(true);
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        const response = await fetch('http://localhost:8080/api/files/upload', {
          method: 'POST',
          body: formDataFile,
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
      const tags = formData.tagsString?.split(",").map((t) => t.trim()).filter(Boolean) || [];
      await posts.update(Number(params.id), {
        title: formData.title,
        content: formData.content,
        themeId: Number(formData.themeId),
        tags,
        status: formData.status,
        featuredImage,
      });
      toast.success("Article modifié avec succès");
      router.push(`/posts/${params.id}`);
    } catch (e) {
      toast.error("Erreur lors de la modification de l'article");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Modifier l'article</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            id="title"
            {...register("title")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenu</label>
          <textarea
            id="content"
            rows={10}
            {...register("content")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>
        <div>
          <label htmlFor="themeId" className="block text-sm font-medium text-gray-700">Thème</label>
          <select
            id="themeId"
            {...register("themeId")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Sélectionnez un thème</option>
            {themesList.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
          {errors.themeId && <p className="mt-1 text-sm text-red-600">{errors.themeId.message}</p>}
        </div>
        <div>
          <label htmlFor="tagsString" className="block text-sm font-medium text-gray-700">Tags (séparés par des virgules)</label>
          <input
            type="text"
            id="tagsString"
            {...register("tagsString")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
          <select
            id="status"
            {...register("status")}
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
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
} 
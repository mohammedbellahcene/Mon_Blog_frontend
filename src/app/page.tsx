import { Suspense } from 'react';
import Link from 'next/link';
import { posts } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

async function getPosts() {
  try {
    const { data } = await posts.getAll();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Aucun article disponible</h2>
          <p className="mt-2 text-gray-600">
            Il n'y a pas encore d'articles publiés ou le serveur est indisponible.
          </p>
          <Link
            href="/posts/new"
            className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Créer un article
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div>Chargement des articles...</div>}>
          {posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-48 object-contain bg-white"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    {post.theme.name}
                  </span>
                  <time className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </time>
                </div>
                <Link href={`/posts/${post.id}`}>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-3 text-sm text-gray-500 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="text-sm text-gray-500 mt-2">
                  {post.viewCount} vues
                </div>
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
                    {post.tags.map((tag) => (
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
            </article>
          ))}
        </Suspense>
      </div>
    </main>
  );
} 
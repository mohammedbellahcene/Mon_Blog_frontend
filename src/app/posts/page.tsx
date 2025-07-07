import { posts } from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

async function getPosts() {
  try {
    const { data } = await posts.getAll();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return { content: [] };
  }
}

export default async function PostsPage() {
  const { content: postsList } = await getPosts();

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
        {(postsList ?? []).map((post: any) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-48 object-contain bg-white"
              />
            )}
            <div className="p-6">
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
              
              <div className="text-sm text-gray-500 mt-4">
                <span>{post.viewCount} vues</span>
                <span className="ml-4">👍 {post.likeCount} </span>
                <span className="ml-2">👎 {post.dislikeCount}</span>
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
          </Link>
        ))}
      </div>
    </div>
  );
} 
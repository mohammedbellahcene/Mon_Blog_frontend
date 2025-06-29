import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { posts } from '@/lib/api';
import CommentSection from '@/components/CommentSection';

async function getPost(id: string) {
  try {
    const { data } = await posts.getById(id);
    return data;
  } catch (error) {
    notFound();
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return (
    <article className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            {post.theme.name}
          </span>
          <time>
            {format(new Date(post.createdAt), 'PPP', { locale: fr })}
          </time>
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
import PostDetail from './PostDetail';
import { notFound } from 'next/navigation';
import { posts } from '@/lib/server-api';

export default async function PostPage({ params }: { params: { id: string } }) {
  try {
    const post = await posts.getById(params.id);
    return <PostDetail post={post} />;
  } catch (error) {
    notFound();
  }
} 
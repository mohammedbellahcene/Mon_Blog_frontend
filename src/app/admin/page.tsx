import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import AdminDashboardClient from '../../components/AdminDashboardClient';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.roles?.includes('ROLE_ADMIN')) {
    redirect('/');
  }
  return <AdminDashboardClient />;
} 
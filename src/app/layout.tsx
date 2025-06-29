import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import SWRProvider from '@/components/SWRProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mon Blog',
  description: 'Un blog moderne avec Next.js et Spring Boot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <SWRProvider>
            <Navbar />
            {children}
            <Toaster />
          </SWRProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 
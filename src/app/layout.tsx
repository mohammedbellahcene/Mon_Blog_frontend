import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import SWRProvider from '@/components/SWRProvider';
import Footer from "../components/Footer";
import PrivacyModal from "../components/PrivacyModal";
import CookieConsentBanner from "../components/CookieConsentBanner";
import ClientLayout from "../components/ClientLayout";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mon Blog',
  description: 'Un blog moderne avec Next.js et Spring Boot',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <SWRProvider>
            <Navbar />
            <ClientLayout>
              {children}
            </ClientLayout>
            <Toaster />
          </SWRProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 
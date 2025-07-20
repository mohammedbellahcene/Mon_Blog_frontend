'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Nouvel article', href: '/posts/new' },
];

function isAdmin(session: any) {
  return session?.user?.roles?.includes('ROLE_ADMIN');
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession({ required: false });
  const isConnected = status === 'authenticated';
  const avatarUrl = session?.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || session?.user?.email || 'U')}`;

  return (
    <Disclosure as="nav" className="bg-white shadow px-4 py-3">
      {({ open }) => (
        <>
          <div className="flex items-center justify-between">
            <div className="font-bold text-xl text-blue-600">Mon Blog</div>
            <div className="hidden md:flex gap-6 items-center">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      isActive
                        ? 'text-blue-600 underline'
                        : 'text-gray-700 hover:text-blue-500',
                      'text-base font-medium transition'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {isAdmin(session) && (
                <Link
                  href="/admin"
                  className={clsx(
                    pathname.startsWith('/admin')
                      ? 'text-blue-600 underline'
                      : 'text-red-500 hover:text-red-700',
                    'text-base font-medium transition'
                  )}
                >
                  Admin
                </Link>
              )}
            </div>
            <div className="hidden md:flex gap-4 items-center">
              {isConnected ? (
                <>
                  <span className="text-sm text-gray-700">{session.user?.name}</span>
                  <div className="relative w-9 h-9 ml-2">
                    <img
                      src={avatarUrl}
                      alt={session.user?.name || 'Avatar'}
                      className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                    />
                    <span
                      className="absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white bg-green-500"
                      title="Connecté"
                      aria-label="Connecté"
                    />
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-500 ml-2"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded bg-white px-3 py-1 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-blue-50"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden flex items-center">
              <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                <span className="sr-only">Ouvrir le menu principal</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
          </div>
          <Disclosure.Panel className="md:hidden mt-2">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      isActive
                        ? 'block border-l-4 border-blue-500 bg-blue-50 text-blue-700 py-2 pl-3 pr-4 text-base font-medium'
                        : 'block border-l-4 border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 py-2 pl-3 pr-4 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {isAdmin(session) && (
                <Link
                  href="/admin"
                  className={clsx(
                    pathname.startsWith('/admin')
                      ? 'block border-l-4 border-blue-500 bg-blue-50 text-blue-700 py-2 pl-3 pr-4 text-base font-medium'
                      : 'block border-l-4 border-transparent text-red-600 hover:border-gray-300 hover:bg-gray-50 hover:text-red-800 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                >
                  Admin
                </Link>
              )}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4 flex items-center gap-3 px-4">
              {isConnected ? (
                <>
                  <div className="relative w-9 h-9">
                    <img
                      src={avatarUrl}
                      alt={session.user?.name || 'Avatar'}
                      className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                    />
                    <span
                      className="absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white bg-green-500"
                      title="Connecté"
                      aria-label="Connecté"
                    />
                  </div>
                  <div className="font-medium text-gray-800">{session.user?.name}</div>
                  <button
                    onClick={() => signOut()}
                    className="block w-full border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <div className="space-y-1 px-4 w-full">
                  <Link
                    href="/auth/login"
                    className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-blue-50"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
} 
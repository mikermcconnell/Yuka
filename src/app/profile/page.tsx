'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/layout';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useHistory } from '@/hooks/useHistory';
import { useFavorites } from '@/hooks/useFavorites';
import { useLists } from '@/hooks/useLists';
import { formatDate } from '@/lib/utils/formatters';
import { clearProductCache } from '@/lib/api/openFoodFacts';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const { history } = useHistory();
  const { favorites } = useFavorites();
  const { lists } = useLists();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleClearCache = () => {
    clearProductCache();
    alert('Cache cleared successfully');
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header title="Profile" />
        <main className="px-4 py-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Yuka Clone</h2>
            <p className="text-gray-600 mb-6">
              Sign in to save your history, favorites, and custom lists
            </p>
            <Button onClick={() => router.push('/auth/login')}>
              Sign In with Google
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Profile" />

      <main className="px-4 py-6 space-y-6">
        {/* User info */}
        <Card className="flex items-center gap-4">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'Profile'}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">
              {user.displayName || 'User'}
            </h2>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-2xl font-bold text-green-600">{history.length}</p>
            <p className="text-xs text-gray-500">Scans</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-green-600">{favorites.length}</p>
            <p className="text-xs text-gray-500">Favorites</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-green-600">{lists.length}</p>
            <p className="text-xs text-gray-500">Lists</p>
          </Card>
        </div>

        {/* Settings */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
          <div className="space-y-3">
            <button
              onClick={handleClearCache}
              className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 -mx-4 px-4 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-gray-700">Clear product cache</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </Card>

        {/* About */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">About</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Yuka Clone v1.0.0</p>
            <p>
              Data provided by{' '}
              <a
                href="https://world.openfoodfacts.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                Open Food Facts
              </a>
            </p>
          </div>
        </Card>

        {/* Sign out */}
        <Button
          onClick={handleSignOut}
          loading={loading}
          variant="outline"
          fullWidth
          className="!border-red-200 !text-red-600 hover:!bg-red-50"
        >
          Sign Out
        </Button>
      </main>
    </div>
  );
}

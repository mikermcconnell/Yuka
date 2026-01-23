'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, LoadingSpinner } from '@/components/layout';
import { Button, Card, Input, Modal } from '@/components/ui';
import { useLists } from '@/hooks/useLists';
import { useAuth } from '@/hooks/useAuth';
import { formatRelativeTime } from '@/lib/utils/formatters';

export default function ListsPage() {
  const { user } = useAuth();
  const { lists, loading, createNewList } = useLists();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    setCreating(true);
    try {
      await createNewList(newListName.trim(), newListDescription.trim() || undefined);
      setShowCreateModal(false);
      setNewListName('');
      setNewListDescription('');
    } catch {
      // Handle error
    } finally {
      setCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header title="Lists" />
        <main className="px-4 py-6">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to create lists</h2>
            <p className="text-gray-600 mb-6">
              Organize products into custom lists
            </p>
            <Button onClick={() => window.location.href = '/auth/login'}>
              Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="My Lists" />

      <main className="px-4 py-6">
        {/* Create button */}
        <Button
          onClick={() => setShowCreateModal(true)}
          fullWidth
          className="mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New List
        </Button>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty state */}
        {!loading && lists.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No lists yet</h2>
            <p className="text-gray-600">
              Create lists to organize your products
            </p>
          </div>
        )}

        {/* Lists */}
        {!loading && lists.length > 0 && (
          <div className="space-y-3">
            {lists.map((list) => (
              <Link key={list.id} href={`/lists/${list.id}`}>
                <Card clickable className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{list.name}</h3>
                    {list.description && (
                      <p className="text-sm text-gray-500 truncate">{list.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {list.products.length} products • Updated {formatRelativeTime(list.updatedAt)}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Create List Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New List"
        >
          <div className="space-y-4">
            <Input
              label="List Name"
              placeholder="e.g., Healthy Snacks"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              maxLength={50}
            />
            <Input
              label="Description (optional)"
              placeholder="e.g., Low sugar snacks for work"
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              maxLength={200}
            />
            <div className="flex gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateList}
                loading={creating}
                disabled={!newListName.trim()}
                className="flex-1"
              >
                Create
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}

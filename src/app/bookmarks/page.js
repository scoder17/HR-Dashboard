'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserCard from '@/components/UserCard'
import SearchBar from '@/components/SearchBar'
import FilterDropdown from '@/components/FilterDropDown'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import useBookmarks from '@/hooks/useBookmarks'
import useSearch from '@/hooks/useSearch'

export default function BookmarksPage() {
  const router = useRouter();
  const { bookmarkedUsers, removeBookmark, clearAllBookmarks } = useBookmarks();
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // const {
  //   searchTerm,
  //   setSearchTerm,
  //   selectedFilters,
  //   setSelectedFilters,
  //   filteredData
  // } = useSearch(bookmarkedUsers);

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredData
  } = useSearch(bookmarkedUsers, ['firstName', 'lastName', 'email']);

  // Department options for filtering
  const departments = [...new Set(bookmarkedUsers.map(user => user.department))];
  const departmentOptions = departments.map(dept => ({ value: dept, label: dept }));

  // Rating options for filtering
  const ratingOptions = [
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  const handlePromote = (user) => {
    setSelectedUser(user);
    setShowPromoteModal(true);
  };

  const handleAssignToProject = (user) => {
    setSelectedUser(user);
    setShowAssignModal(true);
  };

  const handleBulkAction = () => {
    if (selectedUsers.length === 0) return;
    
    if (bulkAction === 'promote') {
      setShowPromoteModal(true);
    } else if (bulkAction === 'assign') {
      setShowAssignModal(true);
    } else if (bulkAction === 'remove') {
      selectedUsers.forEach(userId => removeBookmark(userId));
      setSelectedUsers([]);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredData.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredData.map(user => user.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Bookmarked Employees
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your saved employee profiles and take actions
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                Back to Dashboard
              </Button>
              {bookmarkedUsers.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={clearAllBookmarks}
                >
                  Clear All Bookmarks
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Bookmarks
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {bookmarkedUsers.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              High Performers
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {bookmarkedUsers.filter(user => user.rating >= 4).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Selected
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {selectedUsers.length}
            </p>
          </div>
        </div>

        {bookmarkedUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start bookmarking employees from the main dashboard to see them here.
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <>
            {/* Search and Filter Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholder="Search bookmarked employees..."
                  />
                </div>
                <div className="flex gap-2">
                  {/* <FilterDropdown
                    options={departmentOptions}
                    selected={selectedFilters.departments || []}
                    onChange={(values) => setSelectedFilters(prev => ({ ...prev, departments: values }))}
                    placeholder="Filter by Department"
                  /> */}
                  <FilterDropdown
                    options={departmentOptions}
                    selected={filters.departments || []}
                    onChange={(values) => updateFilter('departments', values)}
                    placeholder="Filter by Department"
                  />
                  {/* <FilterDropdown
                    options={ratingOptions}
                    selected={selectedFilters.ratings || []}
                    onChange={(values) => setSelectedFilters(prev => ({ ...prev, ratings: values }))}
                    placeholder="Filter by Rating"
                  /> */}
                  <FilterDropdown
                    options={ratingOptions}
                    selected={filters.ratings || []}
                    onChange={(values) => updateFilter('ratings', values)}
                    placeholder="Filter by Rating"
                  />
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Select All ({selectedUsers.length} selected)
                  </span>
                </div>
                
                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <select
                      value={bulkAction}
                      onChange={(e) => setBulkAction(e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Bulk Actions</option>
                      <option value="promote">Promote Selected</option>
                      <option value="assign">Assign to Project</option>
                      <option value="remove">Remove from Bookmarks</option>
                    </select>
                    <Button
                      size="sm"
                      onClick={handleBulkAction}
                      disabled={!bulkAction}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((user) => (
                <div key={user.id} className="relative">
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <UserCard
                    user={user}
                    onView={() => router.push(`/employee/${user.id}`)}
                    onBookmark={() => removeBookmark(user.id)}
                    onPromote={() => handlePromote(user)}
                    isBookmarked={true}
                    showActions={true}
                    additionalActions={[
                      {
                        label: 'Assign to Project',
                        onClick: () => handleAssignToProject(user),
                        variant: 'secondary'
                      }
                    ]}
                  />
                </div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No bookmarked employees match your current filters.
                </p>
              </div>
            )}
          </>
        )}

        {/* Promote Modal */}
        <Modal
          isOpen={showPromoteModal}
          onClose={() => {
            setShowPromoteModal(false);
            setSelectedUser(null);
            setSelectedUsers([]);
          }}
          title="Promote Employee(s)"
        >
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedUsers.length > 1 
                ? `Promote ${selectedUsers.length} selected employees?`
                : `Promote ${selectedUser?.firstName} ${selectedUser?.lastName}?`
              }
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Position
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Senior Developer</option>
                <option>Team Lead</option>
                <option>Manager</option>
                <option>Senior Manager</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Effective Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPromoteModal(false);
                  setSelectedUser(null);
                  setSelectedUsers([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle promotion logic here
                alert('Promotion processed successfully!');
                setShowPromoteModal(false);
                setSelectedUser(null);
                setSelectedUsers([]);
              }}>
                Confirm Promotion
              </Button>
            </div>
          </div>
        </Modal>

        {/* Assign to Project Modal */}
        <Modal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedUser(null);
            setSelectedUsers([]);
          }}
          title="Assign to Project"
        >
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedUsers.length > 1 
                ? `Assign ${selectedUsers.length} selected employees to a project?`
                : `Assign ${selectedUser?.firstName} ${selectedUser?.lastName} to a project?`
              }
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Project
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Mobile App Redesign</option>
                <option>Database Migration</option>
                <option>Customer Portal</option>
                <option>Analytics Dashboard</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role in Project
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Developer</option>
                <option>Lead Developer</option>
                <option>Project Manager</option>
                <option>QA Engineer</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedUser(null);
                  setSelectedUsers([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle project assignment logic here
                alert('Project assignment completed successfully!');
                setShowAssignModal(false);
                setSelectedUser(null);
                setSelectedUsers([]);
              }}>
                Assign to Project
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
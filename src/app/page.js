'use client'

import { useEffect } from 'react'
import useStore from '@/store/useStore'
import { fetchUsers } from '@/lib/api'
import UserCard from '@/components/UserCard'
import SearchBar from '@/components/SearchBar'
import FilterDropdown from '@/components/FilterDropDown'
import Button from '@/components/ui/Button'

const Dashboard = () => {
  const { 
    users, 
    loading, 
    error, 
    setUsers, 
    setLoading, 
    setError,
    getFilteredUsers,
    searchQuery,
    selectedDepartments,
    selectedRatings
  } = useStore()
  
  const filteredUsers = getFilteredUsers()
  
  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const userData = await fetchUsers()
        setUsers(userData)
      } catch (err) {
        setError('Failed to load employee data. Please try again.')
        console.error('Error loading users:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (users.length === 0) {
      loadUsers()
    }
  }, [users.length, setUsers, setLoading, setError])
  
  const handleRefresh = async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await fetchUsers()
      setUsers(userData)
    } catch (err) {
      setError('Failed to refresh data. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Get summary stats
  const stats = {
    total: users.length,
    departments: [...new Set(users.map(u => u.department))].length,
    avgRating: users.length > 0 ? (users.reduce((sum, u) => sum + u.rating, 0) / users.length).toFixed(1) : 0,
    topPerformers: users.filter(u => u.rating >= 4).length
  }
  
  const activeFiltersCount = selectedDepartments.length + selectedRatings.length
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employee Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and track employee performance across your organization
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-lg">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-lg">🏢</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Departments</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.departments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-md flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-lg">⭐</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.avgRating}/5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-lg">🏆</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Performers</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.topPerformers}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div>
          <FilterDropdown />
        </div>
      </div>
      
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredUsers.length} of {users.length} employees
          {searchQuery && (
            <span className="ml-1">
              for &quot;{searchQuery}&quot;
            </span>
          )}
          {activeFiltersCount > 0 && (
            <span className="ml-1">
              with {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
            </span>
          )}
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Loading employees...</p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="ml-auto"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
      
      {/* User Cards Grid */}
      {!loading && !error && (
        <>
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No employees found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || activeFiltersCount > 0 
                  ? 'Try adjusting your search or filters'
                  : 'No employee data available'
                }
              </p>
            </div>
          )}
        </>
      )}
      </div>
  );
}

export default Dashboard
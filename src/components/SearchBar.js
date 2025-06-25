'use client'

import { useState } from 'react'
import useStore from '@/store/useStore'

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  
  const handleSearch = (e) => {
    const value = e.target.value
    setLocalQuery(value)
    
    // Debounce search - update store after user stops typing
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(() => {
      setSearchQuery(value)
    }, 300)
  }
  
  const clearSearch = () => {
    setLocalQuery('')
    setSearchQuery('')
  }
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <input
        type="text"
        placeholder="Search by name, email, or department..."
        value={localQuery}
        onChange={handleSearch}
        className="w-full pl-10 pr-10 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
      />
      
      {localQuery && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchBar
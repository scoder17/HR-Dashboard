'use client'

import { useState } from 'react'
import useStore from '@/store/useStore'
import Button from './ui/Button'
import Badge from './ui/Badge'

const FilterDropdown = () => {
  const { 
    selectedDepartments, 
    selectedRatings, 
    setSelectedDepartments, 
    setSelectedRatings,
    users 
  } = useStore()
  
  const [isOpen, setIsOpen] = useState(false)
  
  // Get unique departments from users
  const departments = [...new Set(users.map(user => user.department))].sort()
  const ratings = [1, 2, 3, 4, 5]
  
  const toggleDepartment = (dept) => {
    if (selectedDepartments.includes(dept)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== dept))
    } else {
      setSelectedDepartments([...selectedDepartments, dept])
    }
  }
  
  const toggleRating = (rating) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter(r => r !== rating))
    } else {
      setSelectedRatings([...selectedRatings, rating])
    }
  }
  
  const clearAllFilters = () => {
    setSelectedDepartments([])
    setSelectedRatings([])
  }
  
  const activeFiltersCount = selectedDepartments.length + selectedRatings.length
  
  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeFiltersCount > 0 && (
          <Badge variant="primary" size="sm" className="ml-2">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              )}
            </div>
            
            {/* Department Filters */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departments
              </h4>
              <div className="space-y-2">
                {departments.map(dept => (
                  <label key={dept} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDepartments.includes(dept)}
                      onChange={() => toggleDepartment(dept)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {dept}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Rating Filters */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Performance Rating
              </h4>
              <div className="space-y-2">
                {ratings.map(rating => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleRating(rating)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      {rating} Star{rating > 1 ? 's' : ''}
                      <span className="ml-1 text-yellow-400">
                        {'★'.repeat(rating)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default FilterDropdown
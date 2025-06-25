'use client'

import Link from 'next/link'
import useStore from '@/store/useStore'
import Card, { CardBody, CardFooter } from './ui/Card'
import Button from './ui/Button'
import Badge, { StarRating } from './ui/Badge'

const UserCard = ({ user }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useStore()
  const bookmarked = isBookmarked(user.id)
  
  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(user.id)
    } else {
      addBookmark(user.id)
    }
  }
  
  const handlePromote = () => {
    // Mock promotion action
    alert(`${user.firstName} ${user.lastName} has been promoted! 🎉`)
  }
  
  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success'
    if (rating >= 3) return 'warning'
    return 'danger'
  }
  
  return (
    <Card hover className="h-full">
      <CardBody className="p-6">
        {/* User Avatar & Basic Info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {user.email}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <Badge variant="primary" size="sm">
                {user.department}
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Age: {user.age}
              </span>
            </div>
          </div>
          
          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-colors ${
              bookmarked 
                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
        
        {/* Performance Rating */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Performance Rating
            </span>
            <Badge variant={getRatingColor(user.rating)} size="sm">
              {user.rating}/5
            </Badge>
          </div>
          <StarRating rating={user.rating} size="sm" />
        </div>
        
        {/* Additional Info */}
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {user.address.city}, {user.address.state}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {user.phone}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6 0h6" />
            </svg>
            Hired: {new Date(user.hireDate).toLocaleDateString()}
          </div>
        </div>
      </CardBody>
      
      <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex space-x-2 w-full">
          <Link href={`/employee/${user.id}`} className="flex-1">
            <Button variant="primary" className="w-full" size="sm">
              View Details
            </Button>
          </Link>
          <Button 
            variant="success" 
            size="sm" 
            onClick={handlePromote}
            className="px-4"
          >
            Promote
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default UserCard
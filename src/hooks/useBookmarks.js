import useStore from '@/store/useStore'

const useBookmarks = () => {
  const { 
    bookmarks, 
    users, 
    addBookmark, 
    removeBookmark, 
    isBookmarked 
  } = useStore()
  
  // Get bookmarked users
  const getBookmarkedUsers = () => {
    return users.filter(user => bookmarks.includes(user.id))
  }
  
  // Toggle bookmark status
  const toggleBookmark = (userId) => {
    if (isBookmarked(userId)) {
      removeBookmark(userId)
      return false
    } else {
      addBookmark(userId)
      return true
    }
  }
  
  // Clear all bookmarks
  const clearAllBookmarks = () => {
    bookmarks.forEach(userId => removeBookmark(userId))
  }
  
  return {
    bookmarks,
    bookmarkedUsers: getBookmarkedUsers(),
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    clearAllBookmarks,
    bookmarkCount: bookmarks.length
  }
}

export default useBookmarks
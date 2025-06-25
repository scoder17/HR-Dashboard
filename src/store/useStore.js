import { create } from 'zustand'

const useStore = create((set, get) => ({
  // User data
  users: [],
  loading: false,
  error: null,
  
  // Bookmarks
  bookmarks: [],
  
  // Search and filters
  searchQuery: '',
  selectedDepartments: [],
  selectedRatings: [],
  
  // Theme
  isDarkMode: false,
  
  // Actions
  setUsers: (users) => set({ users }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Bookmark actions
  addBookmark: (userId) => set((state) => ({
    bookmarks: [...state.bookmarks, userId]
  })),
  
  removeBookmark: (userId) => set((state) => ({
    bookmarks: state.bookmarks.filter(id => id !== userId)
  })),
  
  isBookmarked: (userId) => {
    const state = get()
    return state.bookmarks.includes(userId)
  },
  
  // Search actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedDepartments: (departments) => set({ selectedDepartments: departments }),
  setSelectedRatings: (ratings) => set({ selectedRatings: ratings }),
  
  // Theme actions
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  // Filtered users getter
  getFilteredUsers: () => {
    const state = get()
    let filtered = state.users
    
    // Search filter
    if (state.searchQuery) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    }
    
    // Department filter
    if (state.selectedDepartments.length > 0) {
      filtered = filtered.filter(user =>
        state.selectedDepartments.includes(user.department)
      )
    }
    
    // Rating filter
    if (state.selectedRatings.length > 0) {
      filtered = filtered.filter(user =>
        state.selectedRatings.includes(user.rating)
      )
    }
    
    return filtered
  }
}))

export default useStore;
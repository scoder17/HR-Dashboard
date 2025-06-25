// API utilities for fetching and transforming data

const departments = [
  'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 
  'Operations', 'Design', 'Customer Support'
]

const generateMockData = (user) => {
  // Generate consistent data based on user ID
  const seed = user.id
  
  return {
    ...user,
    department: departments[seed % departments.length],
    rating: Math.floor((seed * 17) % 5) + 1, // Random rating 1-5
    salary: 50000 + (seed * 1000) % 100000,
    hireDate: new Date(2020 + (seed % 4), seed % 12, (seed % 28) + 1).toISOString().split('T')[0],
    bio: `Experienced professional in ${departments[seed % departments.length]} with a passion for innovation and teamwork.`,
    projects: [
      `Project Alpha - ${departments[seed % departments.length]}`,
      `Initiative Beta - Team Lead`,
      `Campaign Gamma - Contributor`
    ].slice(0, (seed % 3) + 1),
    feedback: [
      {
        date: '2024-01-15',
        feedback: 'Excellent performance and great team collaboration.',
        rating: Math.floor((seed * 13) % 5) + 1
      },
      {
        date: '2023-09-10',
        feedback: 'Shows strong leadership skills and attention to detail.',
        rating: Math.floor((seed * 19) % 5) + 1
      }
    ],
    performanceHistory: Array.from({ length: 6 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
      rating: Math.floor(((seed + i) * 11) % 5) + 1
    }))
  }
}

export const fetchUsers = async () => {
  try {
    const response = await fetch('https://dummyjson.com/users?limit=20')
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    const data = await response.json()
    
    // Transform and add mock data
    const transformedUsers = data.users.map(user => generateMockData(user))
    
    return transformedUsers
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const fetchUserById = async (id) => {
  try {
    const response = await fetch(`https://dummyjson.com/users/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    const user = await response.json()
    
    return generateMockData(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Analytics data generator
export const generateAnalyticsData = (users) => {
  const departmentStats = {}
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  
  users.forEach(user => {
    // Department averages
    if (!departmentStats[user.department]) {
      departmentStats[user.department] = { total: 0, count: 0 }
    }
    departmentStats[user.department].total += user.rating
    departmentStats[user.department].count += 1
    
    // Rating distribution
    ratingDistribution[user.rating]++
  })
  
  // Calculate averages
  const departmentAverages = Object.entries(departmentStats).map(([dept, stats]) => ({
    department: dept,
    average: (stats.total / stats.count).toFixed(1),
    count: stats.count
  }))
  
  return {
    departmentAverages,
    ratingDistribution: Object.entries(ratingDistribution).map(([rating, count]) => ({
      rating: `${rating} Star${rating > 1 ? 's' : ''}`,
      count
    }))
  }
}
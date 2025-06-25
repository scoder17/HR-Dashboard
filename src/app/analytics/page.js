'use client';

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import useStore from '@/store/useStore'

// Mock departments for consistent data
const departments = [
  'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 
  'Operations', 'Design', 'Legal', 'IT Support'
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1'];

const processAnalyticsData = (users) => {
  // Assign random departments and ratings to users
  const usersWithDepartments = users.map(user => ({
    ...user,
    department: departments[Math.floor(Math.random() * departments.length)],
    rating: Math.floor(Math.random() * 5) + 1,
    isBookmarked: Math.random() > 0.7 // 30% chance of being bookmarked
  }));

  // Calculate department-wise average ratings
  const departmentRatings = departments.map(dept => {
    const deptUsers = usersWithDepartments.filter(user => user.department === dept);
    const avgRating = deptUsers.length > 0 
      ? deptUsers.reduce((sum, user) => sum + user.rating, 0) / deptUsers.length 
      : 0;
    
    return {
      department: dept,
      avgRating: Number(avgRating.toFixed(1)),
      employeeCount: deptUsers.length,
      totalRating: deptUsers.reduce((sum, user) => sum + user.rating, 0)
    };
  }).filter(dept => dept.employeeCount > 0);

  // Generate bookmark trends (mock monthly data)
  const bookmarkTrends = [
    { month: 'Jan', bookmarks: 12, newHires: 5 },
    { month: 'Feb', bookmarks: 19, newHires: 8 },
    { month: 'Mar', bookmarks: 15, newHires: 3 },
    { month: 'Apr', bookmarks: 25, newHires: 12 },
    { month: 'May', bookmarks: 22, newHires: 7 },
    { month: 'Jun', bookmarks: 30, newHires: 15 }
  ];

  // Performance distribution
  const performanceDistribution = [
    { rating: '1 Star', count: usersWithDepartments.filter(u => u.rating === 1).length, value: 1 },
    { rating: '2 Stars', count: usersWithDepartments.filter(u => u.rating === 2).length, value: 2 },
    { rating: '3 Stars', count: usersWithDepartments.filter(u => u.rating === 3).length, value: 3 },
    { rating: '4 Stars', count: usersWithDepartments.filter(u => u.rating === 4).length, value: 4 },
    { rating: '5 Stars', count: usersWithDepartments.filter(u => u.rating === 5).length, value: 5 }
  ].filter(item => item.count > 0);

  const totalEmployees = usersWithDepartments.length;
  const avgRating = usersWithDepartments.reduce((sum, user) => sum + user.rating, 0) / totalEmployees;
  const totalBookmarks = usersWithDepartments.filter(user => user.isBookmarked).length;

  return {
    departmentRatings,
    bookmarkTrends,
    performanceDistribution,
    totalEmployees,
    avgRating: Number(avgRating.toFixed(1)),
    totalBookmarks
  };
};

const Analytics = () => {
  const { bookmarks } = useStore()
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    departmentRatings: [],
    bookmarkTrends: [],
    performanceDistribution: [],
    totalEmployees: 0,
    avgRating: 0,
    // totalBookmarks: 0
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch users data
        const response = await fetch('https://dummyjson.com/users?limit=20');
        const data = await response.json();
        
        // Process data for analytics
        const processedData = processAnalyticsData(data.users);
        setAnalyticsData(processedData);
        
        // Simulate loading time
        setTimeout(() => setLoading(false), 800);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const getPerformanceBadgeColor = (rating) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800';
    if (rating >= 3.5) return 'bg-blue-100 text-blue-800';
    if (rating >= 2.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            HR Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights into employee performance and engagement metrics
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.totalEmployees}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.avgRating}</p>
                  <span className="text-yellow-500 text-lg">{renderStars(analyticsData.avgRating)}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bookmarked</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{bookmarks.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Performance Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Department Performance Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.departmentRatings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="department" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'avgRating' ? `${value} stars` : value,
                    name === 'avgRating' ? 'Average Rating' : 'Employee Count'
                  ]}
                />
                <Legend />
                <Bar dataKey="avgRating" fill="#3B82F6" name="Average Rating" />
                <Bar dataKey="employeeCount" fill="#10B981" name="Employee Count" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Distribution Pie Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.performanceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ rating, count }) => `${rating}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.performanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Bookmark Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bookmark & Hiring Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.bookmarkTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bookmarks" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Bookmarks"
                />
                <Line 
                  type="monotone" 
                  dataKey="newHires" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="New Hires"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Department Details Table */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Department Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Employees</th>
                    <th className="px-4 py-3">Avg Rating</th>
                    <th className="px-4 py-3">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.departmentRatings
                    .slice()
                    .sort((a, b) => b.avgRating - a.avgRating)
                    .map((dept, index) => (
                    <tr key={dept.department} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {dept.department}
                      </td>
                      <td className="px-4 py-3">{dept.employeeCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span>{dept.avgRating}</span>
                          <span className="text-yellow-500">{renderStars(dept.avgRating)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getPerformanceBadgeColor(dept.avgRating)}>
                          {dept.avgRating >= 4.5 ? 'Excellent' : 
                           dept.avgRating >= 3.5 ? 'Good' : 
                           dept.avgRating >= 2.5 ? 'Average' : 'Needs Improvement'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Key Insights
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  <strong className="text-gray-900 dark:text-white">Top Performing Department:</strong> {
                    analyticsData.departmentRatings.length > 0 
                      ? analyticsData.departmentRatings.reduce((max, dept) => 
                          dept.avgRating > max.avgRating ? dept : max
                        ).department
                      : 'N/A'
                  }
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  <strong className="text-gray-900 dark:text-white">Bookmark Rate:</strong> {
                    ((analyticsData.totalBookmarks / analyticsData.totalEmployees) * 100).toFixed(1)
                  }% of employees are bookmarked
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  <strong className="text-gray-900 dark:text-white">Performance Trend:</strong> {
                    analyticsData.avgRating >= 4 ? 'Strong overall performance' :
                    analyticsData.avgRating >= 3 ? 'Good performance with room for improvement' :
                    'Performance needs attention'
                  }
                </span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Action Items
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Focus on departments with ratings below 3.0</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Increase engagement in low-bookmark departments</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Implement mentorship programs for skill development</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
// Utility functions for the HR Dashboard

export const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Design',
  'Support'
];

export const generateRandomDepartment = () => {
  return departments[Math.floor(Math.random() * departments.length)];
};

export const generateRandomRating = () => {
  return Math.floor(Math.random() * 5) + 1;
};

export const generateRandomProjects = (count = 3) => {
  const projectNames = [
    'Website Redesign',
    'Mobile App Development',
    'Marketing Campaign Q4',
    'Database Migration',
    'Customer Portal',
    'API Integration',
    'Security Audit',
    'Performance Optimization',
    'User Experience Research',
    'Product Launch'
  ];

  const statuses = ['Completed', 'In Progress', 'On Hold', 'Planning'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: projectNames[Math.floor(Math.random() * projectNames.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    progress: Math.floor(Math.random() * 100),
    startDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    endDate: new Date(2024, Math.floor(Math.random() * 12) + 1, Math.floor(Math.random() * 28)).toISOString().split('T')[0]
  }));
};

export const generateRandomFeedback = (count = 5) => {
  const feedback = [
    'Excellent communication skills and leadership qualities',
    'Shows great initiative in problem-solving',
    'Needs improvement in time management',
    'Outstanding technical skills and innovation',
    'Great team player and mentor to junior staff',
    'Consistently meets deadlines and quality standards',
    'Could benefit from additional training in new technologies',
    'Exceptional customer service and client relations',
    'Strong analytical thinking and attention to detail',
    'Demonstrates good work-life balance and stress management'
  ];

  const authors = ['John Manager', 'Sarah Lead', 'Mike Director', 'Lisa VP', 'Tom Supervisor'];
  const ratings = [3, 4, 5];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    author: authors[Math.floor(Math.random() * authors.length)],
    comment: feedback[Math.floor(Math.random() * feedback.length)],
    rating: ratings[Math.floor(Math.random() * ratings.length)],
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    type: Math.random() > 0.5 ? 'Review' : 'Feedback'
  }));
};

export const generatePerformanceHistory = (months = 12) => {
  return Array.from({ length: months }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    rating: Math.floor(Math.random() * 5) + 1,
    goals: Math.floor(Math.random() * 10) + 5,
    completed: Math.floor(Math.random() * 8) + 3
  }));
};

export const enhanceUserData = (users) => {
  return users.map(user => ({
    ...user,
    department: generateRandomDepartment(),
    rating: generateRandomRating(),
    projects: generateRandomProjects(Math.floor(Math.random() * 5) + 1),
    feedback: generateRandomFeedback(Math.floor(Math.random() * 3) + 2),
    performanceHistory: generatePerformanceHistory(),
    bio: `${user.firstName} is a dedicated professional with extensive experience in ${generateRandomDepartment().toLowerCase()}. Known for exceptional work quality and collaborative approach.`,
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
    salary: Math.floor(Math.random() * 100000) + 50000,
    manager: 'John Smith',
    skills: ['JavaScript', 'React', 'Project Management', 'Team Leadership', 'Communication'].slice(0, Math.floor(Math.random() * 3) + 2)
  }));
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'On Hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'Planning': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
};

export const getRatingColor = (rating) => {
  if (rating >= 4) return 'text-green-500';
  if (rating >= 3) return 'text-yellow-500';
  return 'text-red-500';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
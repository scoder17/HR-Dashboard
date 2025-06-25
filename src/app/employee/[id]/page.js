'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, MapPin, Phone, Mail, Calendar, DollarSign, User, Briefcase } from 'lucide-react';
import { fetchUserById } from '@/lib/api';
import { enhanceUserData, formatCurrency, formatDate, getStatusColor, getRatingColor } from '@/lib/utils';
import useBookmarks from '@/hooks/useBookmarks';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { bookmarkedUsers, toggleBookmark } = useBookmarks();

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserById(id);
        const enhancedData = enhanceUserData([userData])[0];
        setEmployee(enhancedData);
      } catch (err) {
        setError('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-64 bg-white dark:bg-gray-800 rounded-lg"></div>
              </div>
              <div className="h-64 bg-white dark:bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Employee Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The requested employee could not be found.</p>
        </Card>
      </div>
    );
  }

  const isBookmarked = bookmarkedUsers.includes(employee.id);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'feedback', label: 'Feedback' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{employee.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{employee.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {employee.address.city}, {employee.address.state}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Joined {formatDate(employee.joinDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatCurrency(employee.salary)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Reports to {employee.manager}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Bio</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{employee.bio}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Performance History</h3>
              <div className="space-y-3">
                {employee.performanceHistory.slice(0, 6).map((history, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <span className="text-gray-700 dark:text-gray-300">{history.month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {renderStars(history.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {history.completed}/{history.goals} goals
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-4">
            {employee.projects.map((project) => (
              <Card key={project.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{project.name}</h3>
                  <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-gray-800 dark:text-gray-200">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Start: {formatDate(project.startDate)}</span>
                    <span>End: {formatDate(project.endDate)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-4">
            {employee.feedback.map((feedback) => (
              <Card key={feedback.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{feedback.author}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(feedback.date)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={feedback.type === 'Review' ? 'default' : 'secondary'}>
                      {feedback.type}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{feedback.comment}</p>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <img
              src={employee.image}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {employee.firstName} {employee.lastName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Badge>{employee.department}</Badge>
                <div className="flex items-center space-x-1">
                  {renderStars(employee.rating)}
                  <span className={`ml-2 font-semibold ${getRatingColor(employee.rating)}`}>
                    {employee.rating}/5
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">Age: {employee.age}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant={isBookmarked ? "default" : "outline"}
                onClick={() => toggleBookmark(employee.id)}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button variant="default">
                Promote
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {renderTabContent()}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Assign to Project
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Department Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Team Size</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg Rating</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">4.2/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Active Projects</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">8</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
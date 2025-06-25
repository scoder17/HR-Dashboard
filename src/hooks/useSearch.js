import { useState, useMemo } from 'react';

export default function useSearch(data, searchFields = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(item => {
        return searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        filtered = filtered.filter(item => {
          const itemValue = getNestedValue(item, key);
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    return filtered;
  }, [data, searchTerm, filters, searchFields]);

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  const hasActiveFilters = searchTerm || Object.values(filters).some(v => v && v.length > 0);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredData,
    hasActiveFilters,
    resultsCount: filteredData.length
  };
}
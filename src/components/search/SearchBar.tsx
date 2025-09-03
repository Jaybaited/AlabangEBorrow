import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { ItemCategory } from '../../contexts/AppContext';

export default function SearchBar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    categoryFilter, 
    setCategoryFilter,
    availabilityFilter,
    setAvailabilityFilter
  } = useApp();

  const categories: { value: ItemCategory | 'all', label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'events', label: 'Events' },
    { value: 'community-service', label: 'Community Service' },
    { value: 'sports', label: 'Sports' },
    { value: 'others', label: 'Others' }
  ];

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search equipment by name or description..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ItemCategory | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Items</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div className="flex items-end">
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>
    </div>
  );
}
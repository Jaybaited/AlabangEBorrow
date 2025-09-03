import React, { useState } from 'react';
import { Plus, Search, Filter, Package, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';
import { Equipment, ItemCategory, ItemCondition } from '../../contexts/AppContext';
import AddEquipmentModal from '../modals/AddEquipmentModal';
import EditEquipmentModal from '../modals/EditEquipmentModal';

export default function InventoryManagement() {
  const { user } = useAuth();
  const { equipment, deleteEquipment } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'all'>('all');

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this equipment? This action cannot be undone.')) {
      deleteEquipment(id);
    }
  };

  const getConditionBadge = (condition: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[condition] || colors.good;
  };

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return 'bg-red-100 text-red-800';
    if (percentage < 20) return 'bg-orange-100 text-orange-800';
    if (percentage < 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage barangay equipment and supplies</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'staff') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Equipment
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ItemCategory | 'all')}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="events">Events</option>
              <option value="community-service">Community Service</option>
              <option value="sports">Sports</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrowed
                </th>
                {(user?.role === 'admin' || user?.role === 'staff') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquipment.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize inline-flex px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                      {item.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityStatus(item.available, item.quantity)}`}>
                        {item.available}/{item.quantity}
                      </span>
                      {item.available < item.quantity * 0.2 && (
                        <AlertCircle className="h-4 w-4 text-red-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getConditionBadge(item.condition)}`}>
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.borrowCount} times
                  </td>
                  {(user?.role === 'admin' || user?.role === 'staff') && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingEquipment(item)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium mb-2">No equipment found</p>
            <p>Try adjusting your search or add new equipment</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddEquipmentModal onClose={() => setShowAddModal(false)} />
      )}
      
      {editingEquipment && (
        <EditEquipmentModal
          equipment={editingEquipment}
          onClose={() => setEditingEquipment(null)}
        />
      )}
    </div>
  );
}
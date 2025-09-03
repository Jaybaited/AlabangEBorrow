import React, { useState } from 'react';
import { X, Package, Save } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { Equipment, ItemCategory, ItemCondition } from '../../contexts/AppContext';

interface EditEquipmentModalProps {
  equipment: Equipment;
  onClose: () => void;
}

export default function EditEquipmentModal({ equipment, onClose }: EditEquipmentModalProps) {
  const { updateEquipment } = useApp();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: equipment.name,
    category: equipment.category,
    description: equipment.description,
    quantity: equipment.quantity,
    available: equipment.available,
    condition: equipment.condition
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    quantity: '',
    available: ''
  });

  const validateForm = () => {
    const newErrors = { name: '', description: '', quantity: '', available: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
      isValid = false;
    }

    if (formData.available < 0 || formData.available > formData.quantity) {
      newErrors.available = `Available must be between 0 and ${formData.quantity}`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      updateEquipment(equipment.id, formData);
      onClose();
    } catch (error) {
      console.error('Failed to update equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Edit Equipment</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter equipment name"
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ItemCategory }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="events">Events</option>
                <option value="community-service">Community Service</option>
                <option value="sports">Sports</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Describe the equipment"
              />
              {errors.description && (
                <p className="text-red-600 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.quantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.quantity && (
                  <p className="text-red-600 text-xs mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.quantity}
                  value={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.available ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.available && (
                  <p className="text-red-600 text-xs mt-1">{errors.available}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as ItemCondition }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Updating...' : 'Update Equipment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
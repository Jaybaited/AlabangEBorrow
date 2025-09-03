import React, { useState } from 'react';
import { X, Calendar, FileText, User } from 'lucide-react';
import { Equipment } from '../../contexts/AppContext';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';

interface BorrowModalProps {
  equipment: Equipment;
  onClose: () => void;
}

export default function BorrowModal({ equipment, onClose }: BorrowModalProps) {
  const { user } = useAuth();
  const { addRequest } = useApp();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    quantity: 1,
    neededDate: '',
    purpose: ''
  });

  const [errors, setErrors] = useState({
    quantity: '',
    neededDate: '',
    purpose: ''
  });

  const validateForm = () => {
    const newErrors = { quantity: '', neededDate: '', purpose: '' };
    let isValid = true;

    if (formData.quantity < 1 || formData.quantity > equipment.available) {
      newErrors.quantity = `Quantity must be between 1 and ${equipment.available}`;
      isValid = false;
    }

    if (!formData.neededDate) {
      newErrors.neededDate = 'Please select a needed date';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.neededDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.neededDate = 'Date cannot be in the past';
        isValid = false;
      }
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Please provide a purpose for borrowing';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      addRequest({
        clientId: user.id,
        clientName: user.name,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        quantity: formData.quantity,
        neededDate: formData.neededDate,
        purpose: formData.purpose,
        status: 'pending'
      });

      onClose();
    } catch (error) {
      console.error('Failed to submit request:', error);
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
            <h3 className="text-xl font-semibold text-gray-900">Borrow Request</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Equipment Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">{equipment.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{equipment.description}</p>
            <div className="flex justify-between text-sm">
              <span>Available: <span className="font-medium">{equipment.available}</span></span>
              <span>Condition: <span className="font-medium capitalize">{equipment.condition}</span></span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max={equipment.available}
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
                Date Needed <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.neededDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, neededDate: e.target.value }))}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.neededDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.neededDate && (
                <p className="text-red-600 text-xs mt-1">{errors.neededDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="Describe the purpose of borrowing this equipment..."
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                    errors.purpose ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows={3}
                />
              </div>
              {errors.purpose && (
                <p className="text-red-600 text-xs mt-1">{errors.purpose}</p>
              )}
            </div>

            {/* Submit Button */}
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
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
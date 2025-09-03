import React from 'react';
import { Package, Calendar, Star } from 'lucide-react';
import { Equipment } from '../../contexts/AppContext';

interface EquipmentCardProps {
  equipment: Equipment;
  onBorrowRequest?: (equipment: Equipment) => void;
}

export default function EquipmentCard({ equipment, onBorrowRequest }: EquipmentCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const availabilityPercentage = (equipment.available / equipment.quantity) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Equipment Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <Package className="h-16 w-16 text-blue-600" />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {equipment.name}
          </h3>
          {equipment.borrowCount > 10 && (
            <div className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <Star className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">Popular</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {equipment.description}
        </p>

        {/* Category */}
        <div className="flex items-center mb-3">
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full capitalize">
            {equipment.category.replace('-', ' ')}
          </span>
        </div>

        {/* Availability */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">Availability</span>
            <span className="text-sm font-medium text-gray-900">
              {equipment.available}/{equipment.quantity}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                availabilityPercentage > 50 ? 'bg-green-500' :
                availabilityPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* Condition and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-gray-500">Condition: </span>
            <span className={`text-xs font-medium capitalize ${getConditionColor(equipment.condition)}`}>
              {equipment.condition}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Borrowed {equipment.borrowCount} times
          </div>
        </div>

        {/* Borrow Button */}
        <button
          onClick={() => onBorrowRequest?.(equipment)}
          disabled={equipment.available === 0}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            equipment.available > 0
              ? 'bg-blue-700 hover:bg-blue-800 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {equipment.available > 0 ? (
            <div className="flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              Request to Borrow
            </div>
          ) : (
            'Currently Unavailable'
          )}
        </button>
      </div>
    </div>
  );
}
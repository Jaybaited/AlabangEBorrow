import React, { useState } from 'react';
import { Package, Search, Filter } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import EquipmentGrid from './EquipmentGrid';
import SearchBar from '../search/SearchBar';
import BorrowModal from '../modals/BorrowModal';
import { Equipment } from '../../contexts/AppContext';

export default function EquipmentBrowse() {
  const { equipment } = useApp();
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const availableEquipment = equipment.filter(e => e.available > 0);

  const handleBorrowRequest = (equipmentItem: Equipment) => {
    setSelectedEquipment(equipmentItem);
    setShowBorrowModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Equipment</h1>
        <p className="text-gray-600">Find and request barangay equipment for your needs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Equipment</p>
              <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Now</p>
              <p className="text-2xl font-bold text-gray-900">{availableEquipment.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Browse */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <SearchBar />
        <EquipmentGrid onBorrowRequest={handleBorrowRequest} />
      </div>

      {/* Borrow Modal */}
      {showBorrowModal && selectedEquipment && (
        <BorrowModal
          equipment={selectedEquipment}
          onClose={() => {
            setShowBorrowModal(false);
            setSelectedEquipment(null);
          }}
        />
      )}
    </div>
  );
}
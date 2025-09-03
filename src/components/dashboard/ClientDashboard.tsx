import React, { useState } from 'react';
import { Package, Plus, Search, Filter } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';
import StatsCard from '../ui/StatsCard';
import EquipmentGrid from '../equipment/EquipmentGrid';
import RequestsTable from '../requests/RequestsTable';
import SearchBar from '../search/SearchBar';
import BorrowModal from '../modals/BorrowModal';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { requests, equipment } = useApp();
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const myRequests = requests.filter(r => r.clientId === user?.id);
  const pendingRequests = myRequests.filter(r => r.status === 'pending');
  const borrowedItems = myRequests.filter(r => r.status === 'borrowed');
  const availableEquipment = equipment.filter(e => e.available > 0);

  const handleBorrowRequest = (equipmentItem) => {
    setSelectedEquipment(equipmentItem);
    setShowBorrowModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Browse and borrow barangay equipment</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="My Requests"
          value={myRequests.length}
          icon={Package}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatsCard
          title="Pending Approval"
          value={pendingRequests.length}
          icon={Package}
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatsCard
          title="Currently Borrowed"
          value={borrowedItems.length}
          icon={Package}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
      </div>

      {/* Search and Browse Equipment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Browse Equipment</h3>
          <div className="text-sm text-gray-600">
            {availableEquipment.length} items available
          </div>
        </div>
        
        <SearchBar />
        <EquipmentGrid onBorrowRequest={handleBorrowRequest} />
      </div>

      {/* My Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">My Requests</h3>
        {myRequests.length > 0 ? (
          <RequestsTable requests={myRequests} showActions={false} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium mb-2">No requests yet</p>
            <p>Start browsing equipment to make your first request</p>
          </div>
        )}
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
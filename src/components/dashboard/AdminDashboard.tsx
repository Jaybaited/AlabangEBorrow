import React from 'react';
import { 
  Package, 
  ClipboardList, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import StatsCard from '../ui/StatsCard';
import EquipmentTable from '../equipment/EquipmentTable';
import RequestsTable from '../requests/RequestsTable';
import AddEquipmentModal from '../modals/AddEquipmentModal';
import { useState } from 'react';

export default function AdminDashboard() {
  const { equipment, requests } = useApp();
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);

  const totalEquipment = equipment.reduce((sum, item) => sum + item.quantity, 0);
  const availableEquipment = equipment.reduce((sum, item) => sum + item.available, 0);
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const borrowedItems = requests.filter(r => r.status === 'borrowed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage the entire e-borrow system</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Equipment"
          value={totalEquipment}
          icon={Package}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatsCard
          title="Available Items"
          value={availableEquipment}
          icon={CheckCircle}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          icon={Clock}
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatsCard
          title="Currently Borrowed"
          value={borrowedItems}
          icon={TrendingUp}
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowAddEquipmentModal(true)}
            className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
          >
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Add Equipment</p>
              <p className="text-sm text-gray-600">Add new items to inventory</p>
            </div>
          </button>
          
          <button 
            onClick={() => window.alert('User management feature coming soon!')}
            className="flex items-center p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
          >
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-600">Add or edit user accounts</p>
            </div>
          </button>
          
          <button 
            onClick={() => window.alert('Request review feature available in Requests section!')}
            className="flex items-center p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors"
          >
            <ClipboardList className="h-8 w-8 text-orange-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Review Requests</p>
              <p className="text-sm text-gray-600">Process pending requests</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Equipment</h3>
          <EquipmentTable equipment={equipment.slice(0, 5)} isAdmin={true} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests</h3>
          <RequestsTable requests={requests.slice(0, 5)} showActions={true} />
        </div>
      </div>

      {/* Add Equipment Modal */}
      {showAddEquipmentModal && (
        <AddEquipmentModal onClose={() => setShowAddEquipmentModal(false)} />
      )}
    </div>
  );
}
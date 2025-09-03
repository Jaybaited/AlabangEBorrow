import React from 'react';
import { ClipboardList, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import StatsCard from '../ui/StatsCard';
import RequestsTable from '../requests/RequestsTable';

export default function StaffDashboard() {
  const { requests, equipment } = useApp();

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const borrowedItems = requests.filter(r => r.status === 'borrowed');
  const lowStockItems = equipment.filter(e => e.available < e.quantity * 0.2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
        <p className="text-gray-600">Manage equipment requests and inventory</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Requests"
          value={pendingRequests.length}
          icon={ClipboardList}
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatsCard
          title="Approved Today"
          value={approvedRequests.length}
          icon={CheckCircle}
          iconColor="text-green-600"
          bgColor="bg-green-50"
        />
        <StatsCard
          title="Currently Borrowed"
          value={borrowedItems.length}
          icon={Package}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatsCard
          title="Low Stock Alert"
          value={lowStockItems.length}
          icon={AlertCircle}
          iconColor="text-red-600"
          bgColor="bg-red-50"
        />
      </div>

      {/* Pending Requests Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pending Requests</h3>
          <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
            {pendingRequests.length} pending
          </span>
        </div>
        {pendingRequests.length > 0 ? (
          <RequestsTable requests={pendingRequests} showActions={true} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No pending requests at the moment</p>
          </div>
        )}
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Only {item.available} of {item.quantity} available
                  </p>
                </div>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  {Math.round((item.available / item.quantity) * 100)}% left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
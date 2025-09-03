import React, { useState } from 'react';
import { ClipboardList, Check, X, Clock, Package, Search, Filter, Eye } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';
import { BorrowRequest, RequestStatus } from '../../contexts/AppContext';
import RequestDetailsModal from '../modals/RequestDetailsModal';

export default function RequestsManagement() {
  const { user } = useAuth();
  const { requests, updateRequest, deleteRequest } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff' || user?.role === 'admin';
  const isClient = user?.role === 'client';

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    // Clients only see their own requests
    const matchesUser = !isClient || request.clientId === user?.id;
    
    return matchesSearch && matchesStatus && matchesUser;
  });

  const handleApprove = (requestId: string) => {
    updateRequest(requestId, { 
      status: 'approved',
      approvedBy: user?.name || 'Staff Member'
    });
  };

  const handleReject = (requestId: string) => {
    updateRequest(requestId, { 
      status: 'rejected',
      notes: 'Request rejected by staff'
    });
  };

  const handleMarkBorrowed = (requestId: string) => {
    updateRequest(requestId, { status: 'borrowed' });
  };

  const handleMarkReturned = (requestId: string) => {
    updateRequest(requestId, { 
      status: 'returned',
      returnDate: new Date().toISOString().split('T')[0],
      conditionOnReturn: 'good'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-orange-100 text-orange-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: Check },
      borrowed: { color: 'bg-blue-100 text-blue-800', icon: Package },
      returned: { color: 'bg-gray-100 text-gray-800', icon: Check },
      rejected: { color: 'bg-red-100 text-red-800', icon: X }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full capitalize ${config.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const getActionButtons = (request: BorrowRequest) => {
    if (!isStaff) return null;

    switch (request.status) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleApprove(request.id)}
              className="flex items-center px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </button>
            <button
              onClick={() => handleReject(request.id)}
              className="flex items-center px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </button>
          </div>
        );
      case 'approved':
        return (
          <button
            onClick={() => handleMarkBorrowed(request.id)}
            className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
          >
            <Package className="h-4 w-4 mr-1" />
            Mark Borrowed
          </button>
        );
      case 'borrowed':
        return (
          <button
            onClick={() => handleMarkReturned(request.id)}
            className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Check className="h-4 w-4 mr-1" />
            Mark Returned
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isClient ? 'My Requests' : 'Requests Management'}
        </h1>
        <p className="text-gray-600">
          {isClient ? 'Track your equipment requests' : 'Manage all equipment requests'}
        </p>
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
                placeholder="Search requests..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="borrowed">Borrowed</option>
              <option value="returned">Returned</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.clientName}</div>
                      <div className="text-sm text-gray-500 truncate max-w-48">{request.purpose}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.equipmentName}</div>
                      <div className="text-sm text-gray-500">Qty: {request.quantity}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>Requested: {new Date(request.requestDate).toLocaleDateString()}</div>
                      <div>Needed: {new Date(request.neededDate).toLocaleDateString()}</div>
                      {request.returnDate && (
                        <div>Returned: {new Date(request.returnDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      {getActionButtons(request)}
                      {isClient && request.status === 'pending' && (
                        <button
                          onClick={() => deleteRequest(request.id)}
                          className="flex items-center px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium mb-2">No requests found</p>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
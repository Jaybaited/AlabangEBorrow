import React from 'react';
import { Check, X, Clock, Package, Eye } from 'lucide-react';
import { BorrowRequest } from '../../contexts/AppContext';
import { useApp } from '../../hooks/useApp';
import { useState } from 'react';
import RequestDetailsModal from '../modals/RequestDetailsModal';

interface RequestsTableProps {
  requests: BorrowRequest[];
  showActions?: boolean;
}

export default function RequestsTable({ requests, showActions = false }: RequestsTableProps) {
  const { updateRequest } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);

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

  const handleApprove = (requestId: string) => {
    updateRequest(requestId, { 
      status: 'approved',
      approvedBy: 'Current User'
    });
  };

  const handleReject = (requestId: string) => {
    updateRequest(requestId, { 
      status: 'rejected',
      notes: 'Request rejected by staff'
    });
  };

  return (
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
            {showActions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.clientName}</div>
                  <div className="text-sm text-gray-500">{request.purpose}</div>
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
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(request.status)}
              </td>
              {showActions && request.status === 'pending' && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
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
                </td>
              )}
              {!showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

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
import React from 'react';
import { X, User, Package, Calendar, FileText, Clock, Check } from 'lucide-react';
import { BorrowRequest } from '../../contexts/AppContext';

interface RequestDetailsModalProps {
  request: BorrowRequest;
  onClose: () => void;
}

export default function RequestDetailsModal({ request, onClose }: RequestDetailsModalProps) {
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
      <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full capitalize ${config.color}`}>
        <IconComponent className="h-4 w-4 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ClipboardList className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Request Details</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Request Info */}
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Request Status</h4>
              {getStatusBadge(request.status)}
            </div>

            {/* Client Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <User className="h-5 w-5 text-gray-600 mr-2" />
                <h5 className="font-medium text-gray-900">Client Information</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{request.clientName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Request ID:</span>
                  <span className="ml-2 font-mono text-xs">{request.id}</span>
                </div>
              </div>
            </div>

            {/* Equipment Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Package className="h-5 w-5 text-blue-600 mr-2" />
                <h5 className="font-medium text-gray-900">Equipment Details</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Equipment:</span>
                  <span className="ml-2 font-medium">{request.equipmentName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <span className="ml-2 font-medium">{request.quantity}</span>
                </div>
              </div>
            </div>

            {/* Date Information */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Calendar className="h-5 w-5 text-green-600 mr-2" />
                <h5 className="font-medium text-gray-900">Timeline</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Request Date:</span>
                  <span className="ml-2 font-medium">{new Date(request.requestDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Needed Date:</span>
                  <span className="ml-2 font-medium">{new Date(request.neededDate).toLocaleDateString()}</span>
                </div>
                {request.returnDate && (
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Return Date:</span>
                    <span className="ml-2 font-medium">{new Date(request.returnDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div>
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                <h5 className="font-medium text-gray-900">Purpose</h5>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {request.purpose}
              </p>
            </div>

            {/* Additional Info */}
            {(request.approvedBy || request.notes || request.conditionOnReturn) && (
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Additional Information</h5>
                <div className="space-y-2 text-sm">
                  {request.approvedBy && (
                    <div>
                      <span className="text-gray-600">Approved by:</span>
                      <span className="ml-2 font-medium">{request.approvedBy}</span>
                    </div>
                  )}
                  {request.notes && (
                    <div>
                      <span className="text-gray-600">Notes:</span>
                      <span className="ml-2">{request.notes}</span>
                    </div>
                  )}
                  {request.conditionOnReturn && (
                    <div>
                      <span className="text-gray-600">Condition on return:</span>
                      <span className="ml-2 capitalize">{request.conditionOnReturn}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
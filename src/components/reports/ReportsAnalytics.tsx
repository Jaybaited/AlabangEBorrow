import React, { useState } from 'react';
import { ClipboardListIcon } from "lucide-react";
import { BarChart3, Download, Calendar, TrendingUp, Package, Users, Clock } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';

export default function ReportsAnalytics() {
  const { user } = useAuth();
  const { equipment, requests } = useApp();
  const [dateRange, setDateRange] = useState('30');

  // Calculate statistics
  const totalRequests = requests.length;
  const approvedRequests = requests.filter(r => r.status === 'approved' || r.status === 'borrowed' || r.status === 'returned').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
  const approvalRate = totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0;

  // Most borrowed equipment
  const equipmentBorrowStats = equipment
    .map(item => ({
      name: item.name,
      borrowCount: item.borrowCount,
      category: item.category
    }))
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  // Request status distribution
  const statusStats = [
    { status: 'Pending', count: requests.filter(r => r.status === 'pending').length, color: 'bg-orange-500' },
    { status: 'Approved', count: requests.filter(r => r.status === 'approved').length, color: 'bg-green-500' },
    { status: 'Borrowed', count: requests.filter(r => r.status === 'borrowed').length, color: 'bg-blue-500' },
    { status: 'Returned', count: requests.filter(r => r.status === 'returned').length, color: 'bg-gray-500' },
    { status: 'Rejected', count: requests.filter(r => r.status === 'rejected').length, color: 'bg-red-500' }
  ];

  const handleExportReport = () => {
    // Simulate report generation
    const reportData = {
      generatedBy: user?.name,
      generatedAt: new Date().toISOString(),
      dateRange: `Last ${dateRange} days`,
      summary: {
        totalRequests,
        approvedRequests,
        rejectedRequests,
        approvalRate
      },
      equipmentStats: equipmentBorrowStats,
      statusDistribution: statusStats
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barangay-eborrow-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">System usage statistics and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={handleExportReport}
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <ClipboardListIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approval Rate</p>
              <p className="text-2xl font-bold text-gray-900">{approvalRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Equipment Items</p>
              <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Processing</p>
              <p className="text-2xl font-bold text-gray-900">2.5 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Borrowed Equipment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Borrowed Equipment</h3>
          <div className="space-y-4">
            {equipmentBorrowStats.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    <span className="text-sm text-gray-600">{item.borrowCount} times</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${Math.max((item.borrowCount / Math.max(...equipmentBorrowStats.map(e => e.borrowCount))) * 100, 5)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Status Distribution</h3>
          <div className="space-y-4">
            {statusStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${stat.color} rounded mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{stat.status}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-3">{stat.count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${stat.color} h-2 rounded-full transition-all`}
                      style={{ 
                        width: `${totalRequests > 0 ? (stat.count / totalRequests) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {requests.slice(0, 10).map((request, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {request.clientName} requested {request.equipmentName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                request.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                request.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                request.status === 'returned' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

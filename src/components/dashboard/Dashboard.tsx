import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import ClientDashboard from './ClientDashboard';
import { useApp } from '../../hooks/useApp';
import InventoryManagement from '../inventory/InventoryManagement';
import RequestsManagement from '../requests/RequestsManagement';
import UserManagement from '../users/UserManagement';
import ReportsAnalytics from '../reports/ReportsAnalytics';
import ScheduleBooking from '../schedule/ScheduleBooking';
import SystemSettings from '../settings/SystemSettings';
import EquipmentBrowse from '../equipment/EquipmentBrowse';

export default function Dashboard() {
  const { user } = useAuth();
  const { currentView } = useApp();

  const renderContent = () => {
    // Common views for all roles
    switch (currentView) {
      case 'inventory':
        return <InventoryManagement />;
      case 'requests':
        return <RequestsManagement />;
      case 'schedule':
        return <ScheduleBooking />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'equipment':
        return <EquipmentBrowse />;
      case 'users':
        return user?.role === 'admin' ? <UserManagement /> : <ClientDashboard />;
      case 'settings':
        return user?.role === 'admin' ? <SystemSettings /> : <ClientDashboard />;
      case 'calendar':
        return <ScheduleBooking />;
      case 'dashboard':
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'staff':
        return <StaffDashboard />;
      case 'client':
        return <ClientDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
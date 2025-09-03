import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Settings,
  Calendar,
  FileText
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';

export default function Sidebar() {
  const { user } = useAuth();
  const { currentView, setCurrentView } = useApp();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
    { icon: Package, label: 'Inventory Management', view: 'inventory' },
    { icon: ClipboardList, label: 'All Requests', view: 'requests' },
    { icon: Users, label: 'User Management', view: 'users' },
    { icon: Calendar, label: 'Schedule & Booking', view: 'schedule' },
    { icon: BarChart3, label: 'Reports & Analytics', view: 'reports' },
    { icon: Settings, label: 'System Settings', view: 'settings' }
  ];

  const staffMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
    { icon: Package, label: 'Inventory', view: 'inventory' },
    { icon: ClipboardList, label: 'Pending Requests', view: 'requests' },
    { icon: Calendar, label: 'Schedule', view: 'schedule' },
    { icon: FileText, label: 'Reports', view: 'reports' }
  ];

  const clientMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
    { icon: Package, label: 'Browse Equipment', view: 'equipment' },
    { icon: ClipboardList, label: 'My Requests', view: 'requests' },
    { icon: Calendar, label: 'Booking Calendar', view: 'calendar' }
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminMenuItems;
      case 'staff':
        return staffMenuItems;
      case 'client':
        return clientMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentView(item.view)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                currentView === item.view
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
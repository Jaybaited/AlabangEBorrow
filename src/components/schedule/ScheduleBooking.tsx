import React, { useState } from 'react';
import { Calendar, Clock, Package, Users, Plus } from 'lucide-react';
import { useApp } from '../../hooks/useApp';

interface BookingEvent {
  id: string;
  title: string;
  equipmentName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  purpose: string;
}

export default function ScheduleBooking() {
  const { requests, equipment } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Convert requests to booking events
  const bookingEvents: BookingEvent[] = requests
    .filter(r => r.status === 'approved' || r.status === 'borrowed')
    .map(request => ({
      id: request.id,
      title: `${request.equipmentName} - ${request.clientName}`,
      equipmentName: request.equipmentName,
      clientName: request.clientName,
      startDate: request.neededDate,
      endDate: request.returnDate || request.neededDate,
      status: request.status === 'borrowed' ? 'confirmed' : 'pending',
      purpose: request.purpose
    }));

  const todayEvents = bookingEvents.filter(event => 
    event.startDate === selectedDate || 
    (event.endDate && event.startDate <= selectedDate && event.endDate >= selectedDate)
  );

  const upcomingEvents = bookingEvents
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = bookingEvents.filter(event => 
        event.startDate === currentDate.toISOString().split('T')[0] ||
        (event.endDate && 
         event.startDate <= currentDate.toISOString().split('T')[0] && 
         event.endDate >= currentDate.toISOString().split('T')[0])
      );
      
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === new Date().toDateString(),
        isSelected: currentDate.toISOString().split('T')[0] === selectedDate,
        events: dayEvents
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule & Booking</h1>
          <p className="text-gray-600">View equipment booking calendar and schedule</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Events</p>
              <p className="text-2xl font-bold text-gray-900">{todayEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{bookingEvents.filter(e => e.status === 'confirmed').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(day.date.toISOString().split('T')[0])}
                className={`p-2 text-sm rounded-lg transition-colors relative ${
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${
                  day.isToday ? 'bg-blue-100 text-blue-700 font-semibold' : ''
                } ${
                  day.isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {day.date.getDate()}
                {day.events.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Bookings</h3>
          <div className="space-y-3">
            {bookingEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.equipmentName}</p>
                    <p className="text-sm text-gray-600">{event.clientName}</p>
                    <p className="text-xs text-gray-500">{event.purpose}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todayEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.equipmentName}</p>
                    <p className="text-sm text-gray-600">{event.clientName}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(event.status)}`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
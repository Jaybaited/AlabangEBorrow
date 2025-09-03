import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RequestStatus = 'pending' | 'approved' | 'borrowed' | 'returned' | 'rejected';
export type ItemCategory = 'events' | 'community-service' | 'sports' | 'others';
export type ItemCondition = 'excellent' | 'good' | 'fair' | 'poor';

export interface Equipment {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  quantity: number;
  available: number;
  condition: ItemCondition;
  image?: string;
  borrowCount: number;
}

export interface BorrowRequest {
  id: string;
  clientId: string;
  clientName: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  requestDate: string;
  neededDate: string;
  returnDate?: string;
  purpose: string;
  status: RequestStatus;
  approvedBy?: string;
  notes?: string;
  conditionOnReturn?: ItemCondition;
}

interface AppContextType {
  equipment: Equipment[];
  requests: BorrowRequest[];
  addEquipment: (equipment: Omit<Equipment, 'id' | 'borrowCount'>) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  addRequest: (request: Omit<BorrowRequest, 'id' | 'requestDate'>) => void;
  updateRequest: (id: string, updates: Partial<BorrowRequest>) => void;
  deleteRequest: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: ItemCategory | 'all';
  setCategoryFilter: (category: ItemCategory | 'all') => void;
  availabilityFilter: 'all' | 'available' | 'unavailable';
  setAvailabilityFilter: (filter: 'all' | 'available' | 'unavailable') => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Folding Tables',
    category: 'events',
    description: '6-feet folding tables perfect for events and gatherings',
    quantity: 50,
    available: 45,
    condition: 'excellent',
    borrowCount: 15
  },
  {
    id: '2',
    name: 'Plastic Chairs',
    category: 'events',
    description: 'Durable plastic chairs for outdoor and indoor events',
    quantity: 200,
    available: 180,
    condition: 'good',
    borrowCount: 25
  },
  {
    id: '3',
    name: 'Sound System',
    category: 'events',
    description: 'Complete PA system with microphones and speakers',
    quantity: 3,
    available: 2,
    condition: 'good',
    borrowCount: 8
  },
  {
    id: '4',
    name: 'First Aid Kit',
    category: 'community-service',
    description: 'Complete first aid kit with medical supplies',
    quantity: 10,
    available: 8,
    condition: 'excellent',
    borrowCount: 12
  },
  {
    id: '5',
    name: 'Basketball',
    category: 'sports',
    description: 'Official size basketballs for community sports',
    quantity: 20,
    available: 15,
    condition: 'good',
    borrowCount: 30
  },
  {
    id: '6',
    name: 'Volleyball Net',
    category: 'sports',
    description: 'Standard volleyball net with posts',
    quantity: 5,
    available: 4,
    condition: 'excellent',
    borrowCount: 18
  }
];

const mockRequests: BorrowRequest[] = [
  {
    id: '1',
    clientId: '3',
    clientName: 'Juan Dela Cruz',
    equipmentId: '1',
    equipmentName: 'Folding Tables',
    quantity: 5,
    requestDate: '2025-01-07',
    neededDate: '2025-01-15',
    purpose: 'Barangay Assembly Meeting',
    status: 'pending'
  },
  {
    id: '2',
    clientId: '3',
    clientName: 'Juan Dela Cruz',
    equipmentId: '2',
    equipmentName: 'Plastic Chairs',
    quantity: 20,
    requestDate: '2025-01-06',
    neededDate: '2025-01-15',
    purpose: 'Barangay Assembly Meeting',
    status: 'approved',
    approvedBy: 'Admin User'
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [requests, setRequests] = useState<BorrowRequest[]>(mockRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'all'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [currentView, setCurrentView] = useState('dashboard');

  const addEquipment = (newEquipment: Omit<Equipment, 'id' | 'borrowCount'>) => {
    const equipment: Equipment = {
      ...newEquipment,
      id: Date.now().toString(),
      borrowCount: 0
    };
    setEquipment(prev => [...prev, equipment]);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteEquipment = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const addRequest = (newRequest: Omit<BorrowRequest, 'id' | 'requestDate'>) => {
    const request: BorrowRequest = {
      ...newRequest,
      id: Date.now().toString(),
      requestDate: new Date().toISOString().split('T')[0]
    };
    setRequests(prev => [...prev, request]);
    
    // Update equipment availability
    const equipmentItem = equipment.find(e => e.id === request.equipmentId);
    if (equipmentItem) {
      updateEquipment(request.equipmentId, {
        available: equipmentItem.available - request.quantity
      });
    }
  };

  const updateRequest = (id: string, updates: Partial<BorrowRequest>) => {
    setRequests(prev => prev.map(request => 
      request.id === id ? { ...request, ...updates } : request
    ));

    // If request is being returned, update equipment availability
    if (updates.status === 'returned') {
      const request = requests.find(r => r.id === id);
      if (request) {
        const equipmentItem = equipment.find(e => e.id === request.equipmentId);
        if (equipmentItem) {
          updateEquipment(request.equipmentId, {
            available: equipmentItem.available + request.quantity,
            borrowCount: equipmentItem.borrowCount + 1
          });
        }
      }
    }
  };

  const deleteRequest = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request && request.status === 'pending') {
      // Return equipment to available pool if request was pending
      const equipmentItem = equipment.find(e => e.id === request.equipmentId);
      if (equipmentItem) {
        updateEquipment(request.equipmentId, {
          available: equipmentItem.available + request.quantity
        });
      }
    }
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <AppContext.Provider value={{
      equipment,
      requests,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      addRequest,
      updateRequest,
      deleteRequest,
      searchQuery,
      setSearchQuery,
      categoryFilter,
      setCategoryFilter,
      availabilityFilter,
      setAvailabilityFilter,
      currentView,
      setCurrentView
    }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext }
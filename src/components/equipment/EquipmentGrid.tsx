import React from 'react';
import { useApp } from '../../hooks/useApp';
import EquipmentCard from './EquipmentCard';

interface EquipmentGridProps {
  onBorrowRequest?: (equipment: any) => void;
}

export default function EquipmentGrid({ onBorrowRequest }: EquipmentGridProps) {
  const { equipment, searchQuery, categoryFilter, availabilityFilter } = useApp();

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && item.available > 0) ||
                               (availabilityFilter === 'unavailable' && item.available === 0);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Sort by popularity (most borrowed first)
  const sortedEquipment = [...filteredEquipment].sort((a, b) => b.borrowCount - a.borrowCount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {sortedEquipment.map(item => (
        <EquipmentCard
          key={item.id}
          equipment={item}
          onBorrowRequest={onBorrowRequest}
        />
      ))}
      {sortedEquipment.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-2">No equipment found</p>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
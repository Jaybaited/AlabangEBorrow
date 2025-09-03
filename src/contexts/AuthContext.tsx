import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'staff' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  barangayId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@alabang.gov.ph',
    password: 'admin123',
    role: 'admin',
    barangayId: 'BRGY-ALABANG-001'
  },
  {
    id: '2',
    name: 'Staff Member',
    email: 'staff@alabang.gov.ph',
    password: 'staff123',
    role: 'staff',
    barangayId: 'BRGY-ALABANG-001'
  },
  {
    id: '3',
    name: 'Juan Dela Cruz',
    email: 'juan@gmail.com',
    password: 'client123',
    role: 'client',
    barangayId: 'BRGY-ALABANG-001'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const emailExists = mockUsers.some(u => u.email === userData.email);
    if (emailExists) {
      return false;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      barangayId: userData.barangayId || 'BRGY-ALABANG-001'
    };

    mockUsers.push({ ...newUser, password: userData.password });
    setUser(newUser);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext }
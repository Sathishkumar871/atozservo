import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Service type (optional - for better TypeScript support)
interface Service {
  _id: string;
  name: string;
  image?: string;
  [key: string]: any;
}

// Create context
const ServiceContext = createContext<Service[] | null>(null);

// Custom hook to access the context
export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServiceContext must be used within a ServiceProvider');
  }
  return context;
};

// Provider component
export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    axios.get('/api/services')
      .then((res) => setServices(res.data))
      .catch((err) => console.error("ServiceContext fetch failed:", err));
  }, []);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

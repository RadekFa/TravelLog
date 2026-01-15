import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; 
import type { Trip, Entry } from './../types/tripTypes'; 
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'travelLogTrips';


interface TripContextType {
  trips: Trip[];
  addTrip: (newTrip: Omit<Trip, 'id' | 'entries'>) => void;
  getTripById: (id: string) => Trip | undefined;
  updateTrip: (updatedTrip: Trip) => void;
  deleteTrip: (id: string) => void;
  addEntry: (tripId: string, entryData: Omit<Entry, 'id'>) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const savedTrips = localStorage.getItem(STORAGE_KEY);
    if (savedTrips) {
      try {
        setTrips(JSON.parse(savedTrips) as Trip[]);
      } catch (e) {
        console.error("Chyba při načítání dat z LocalStorage:", e);
        setTrips([]);
      }
    }
  }, []);

  // Uložení dat při změně stavu
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  // 3. CRUD Operace pro Cesty
  
  const addTrip = (newTripData: Omit<Trip, 'id' | 'entries'>) => {
    const newTrip: Trip = {
      ...newTripData,
      id: uuidv4(), // Generování unikátního ID
      entries: [],   // Nová cesta nemá žádné záznamy
    };
    setTrips(prev => [...prev, newTrip]);
  };

  const getTripById = (id: string) => {
    return trips.find(trip => trip.id === id);
  };

  const updateTrip = (updatedTrip: Trip) => {
    setTrips(prev => 
      prev.map(trip => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  // 4. CRUD Operace pro Záznamy
  
  const addEntry = (tripId: string, entryData: Omit<Entry, 'id'>) => {
      const newEntry: Entry = {
          ...entryData,
          id: uuidv4(),
      };

      setTrips(prev => 
          prev.map(trip => 
              trip.id === tripId 
                  ? { ...trip, entries: [...trip.entries, newEntry] }
                  : trip
          )
      );
  };
  

  return (
    <TripContext.Provider value={{ trips, addTrip, getTripById, updateTrip, deleteTrip, addEntry }}>
      {children}
    </TripContext.Provider>
  );
};

// 5. Custom Hook
export const useTrips = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};
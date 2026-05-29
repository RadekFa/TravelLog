import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; 
import { useAuth } from './AuthContext';

interface Trip {
  id: number;
  country: {
    id: number;
    name: string;
    flag: string;
    continent: string;
  };
  arrivalDate: string;
  departureDate: string;
}

interface TripContextType {
  trips: Trip[];
  // PRÁVĚ UPRAVENO: Typy se změnily na Promise<any>, aby mohly vracet pole achievementů
  addTrip: (countryId: number, start: string, end: string) => Promise<any>;
  updateTrip: (tripId: number, countryId: number, start: string, end: string) => Promise<any>;
  deleteTrip: (tripId: number) => Promise<void>;
  loading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchVisits = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:8080/api/visits/my-visits', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (err) {
      console.error("Error fetching visits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [token]);

  const addTrip = async (countryId: number, start: string, end: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/visits/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          countryId: countryId,
          arrivalDate: start,
          departureDate: end
        })
      });

      if (response.ok) {
        // Zpracujeme JSON s objektem visit a polem newlyUnlocked
        const data = await response.json(); 
        await fetchVisits();
        return data.newlyUnlocked || []; // Vrátíme achievementy do modalu
      }
    } catch (error) {
      console.error("Failed to save trip:", error);
    }
    return [];
  };

  const updateTrip = async (tripId: number, countryId: number, start: string, end: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/visits/${tripId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          countryId: countryId,
          arrivalDate: start,
          departureDate: end
        })
      });

      if (response.ok) {
        const data = await response.json();
        await fetchVisits(); 
        return data.newlyUnlocked || []; // Vrátíme achievementy do modalu
      } else {
        console.error("Failed to update trip on server");
      }
    } catch (error) {
      console.error("Error during updateTrip:", error);
    }
    return [];
  };

  const deleteTrip = async (tripId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/visits/${tripId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTrips(prev => prev.filter(trip => trip.id !== tripId));
      } else {
        console.error("Failed to delete trip on server");
      }
    } catch (error) {
      console.error("Error during deleteTrip:", error);
    }
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip, loading }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrips must be used within TripProvider');
  return context;
};
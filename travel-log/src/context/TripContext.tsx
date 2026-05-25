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
  addTrip: (countryId: number, start: string, end: string) => Promise<void>;
  updateTrip: (tripId: number, countryId: number, start: string, end: string) => Promise<void>;
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
        await fetchVisits();
      }
    } catch (error) {
      console.error("Failed to save trip:", error);
    }
  };

  // NOVÁ METODA: UPDATE
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
        await fetchVisits(); // Znovu načteme data pro synchronizaci UI
      } else {
        console.error("Failed to update trip on server");
      }
    } catch (error) {
      console.error("Error during updateTrip:", error);
    }
  };

  // NOVÁ METODA: DELETE
  const deleteTrip = async (tripId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/visits/${tripId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Můžeme buď znovu fetchovat, nebo jen odfiltrovat lokálně pro rychlost
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
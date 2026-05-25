import BottomMenu from '../components/BottomMenu';
import '../styles/pagesStyles/MainPage.scss'; 
import React, { useState, useEffect } from 'react';
import SimpleWorldMap from '../components/SimpleWorldMap';
import MapLegend from '../components/MapLegend';
import ContinentStats from '../components/ContinentStats';
import ProgressBar from '../components/ProgressBar';
import AddTripModal from "../components/AddTripModal";
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext'; 

const MainPage: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [allCountries, setAllCountries] = useState<any[]>([]);
    const { trips } = useTrips(); 
    const { token } = useAuth();
    const { settings } = useSettings();
    const { t } = useLanguage(); 

    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:8080/api/countries", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setAllCountries(data))
            .catch(err => console.error(t('main_page.error_loading'), err));
    }, [token, t]);

    const visitedCountries = trips.map(t => t.country);
    const uniqueVisitedCount = new Set(visitedCountries.map(c => c.id)).size;

    return (
        <div className="main-page-layout">
            <header className="MainPage-header">
                {/* PŘELOŽENO */}
                <h1>{t('main_page.title')}</h1>
                <p className='subtitle-mainPage'>{t('main_page.subtitle')}</p>
                
                <svg className="plus-icon" viewBox="0 0 24 24" stroke="currentColor" onClick={() => setModalOpen(true)}>
                    <path d="M13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3V11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H11V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H13V3Z" fill="currentColor" />
                </svg>
            </header>

            <AddTripModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
            
            <main className="map-content-placeholder">
                <div id="travel-grid">
                    <SimpleWorldMap />

                    <div className="right-column">
                        <MapLegend 
                            visitedCount={uniqueVisitedCount} 
                            totalCount={allCountries.length > 0 ? allCountries.length : 195}
                        />
                        
                        <ContinentStats
                            visitedCountries={visitedCountries}
                            allCountries={allCountries}
                        />
                    </div>
                </div>
                <ProgressBar 
                    visitedCount={uniqueVisitedCount} 
                    travelGoal={settings.travelGoal} 
                />
            </main>

            <BottomMenu />
        </div>
    );
};

export default MainPage;
import BottomMenu from '../components/BottomMenu';
import '../styles/pagesStyles/MainPage.scss'; 
import React from 'react';
import '../styles/pagesStyles/MainPage.scss'; 
import SimpleWorldMap from '../components/SimpleWorldMap';
import MapLegend from '../components/MapLegend';
import ContinentStats from '../components/ContinentStats';
import { visitedCountriesDB } from '../data/VisitedCountries';
import { allCountries } from '../data/VisitedCountries';
import ProgressBar from '../components/ProgressBar';
import { useState } from "react";
import AddTripModal from "../components/AddTripModal";

const MainPage: React.FC = () => {

    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <div className="main-page-layout">

            <header className="MainPage-header">
                <h1>Travel Log</h1>
                <p className='subtitle-mainPage'>Track the countries you've visited, explore your stats, and plan your next adventures.</p>
                <svg className="plus-icon" viewBox="0 0 24 24" stroke="currentColor" onClick={() => setModalOpen(true)}>
                    <path d="M13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3V11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H11V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H13V3Z" fill="currentColor" />
                </svg>
            </header>
            <AddTripModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
            
            <main className="map-content-placeholder">
                
                <div id="travel-grid">
                <SimpleWorldMap />

                <div className="right-column">
                <MapLegend visitedCount={9}/>
                <ContinentStats
                    visitedCountries={visitedCountriesDB}
                    allCountries={allCountries}
                />
                </div>
                </div>
                <ProgressBar />
                
                
            </main>

            <BottomMenu />

            
            
            
        </div>
    );
};

export default MainPage;
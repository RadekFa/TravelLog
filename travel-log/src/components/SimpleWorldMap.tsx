import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import '../styles/componentsStyles/SimpleWorldMap.scss'; 
import { getGeographyStyle } from '../config/mapStyles'; 
import { useTrips } from '../context/TripContext';

interface GeoProperties {
    name: string;
    iso_a3: string;
    [key: string]: any;
}

interface GeoObject {
    rsmKey: string;
    properties: GeoProperties;
    [key: string]: any;
}

const geoUrl = '/custom.geo.json'; 

const SimpleWorldMap: React.FC = () => {
    const { trips } = useTrips();

    // Odstranili jsme geoIso3 z parametrů, protože ho nepoužíváme
    const checkIsVisited = (geoName: string) => {
    return trips.some(trip => {
        const dbName = trip.country.name.toLowerCase().trim();
        const mapName = geoName.toLowerCase().trim();
        
        // 1. Přímá shoda
        if (dbName === mapName) return true;

        // 2. Ruční mapování nejčastějších rozdílů
        const aliases: Record<string, string[]> = {
            "bosnia and herzegovina": ["bosnia and herz.", "bosnia and herzegovina", "bosnia-herzegovina"],
            "czech republic": ["czechia", "czech rep."],
            "united states": ["united states of america", "usa"],
            "dominican republic": ["dom. rep."],
            "central african republic": ["central african rep."],
            "ivory coast": ["côte d'ivoire", "cote d'ivoire"]
        };

        return aliases[dbName]?.includes(mapName);
    });
};

    return (
        <div className="simple-map-wrapper">
            <ComposableMap viewBox="70 80 740 400" projectionConfig={{ scale: 160 }}>
                <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: GeoObject[] }) =>
                        geographies
                            .filter((geo) => geo.properties.name !== 'Antarctica') 
                            .map((geo) => {
                                const { name } = geo.properties;
                                const isVisited = checkIsVisited(name);
                                            
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        style={getGeographyStyle(isVisited)}
                                        onClick={() => {
                                            console.log(`Kliknuto na: ${name}`);
                                            console.log(`Stav v DB: ${isVisited ? 'Navštíveno' : 'Nenavštíveno'}`);
                                        }}
                                    />
                                );
                            })
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
};

export default SimpleWorldMap;
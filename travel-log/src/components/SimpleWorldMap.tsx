import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import '../styles/componentsStyles/SimpleWorldMap.scss'; 
import { getGeographyStyle } from '../config/mapStyles'; 



// Cesta k JSON souboru s geometriemi (Musí být v /public)
const geoUrl = '/custom.geo.json'; 


const visitedCountriesDB = [
  'USA', 
  'CZE', 
  'SVK', 
  'HUN', 
  'EGY', 
  'AUT', 
  'GRC', 
  'ESP', 
  'POL', 
];

const SimpleWorldMap: React.FC = () => {

   
    const checkIsVisited = (geoId: string) => {
        
        return visitedCountriesDB.includes(geoId);
    };

    return (
        <div className="simple-map-wrapper">
            

            <ComposableMap viewBox="70 80 740 400" projectionConfig={{ scale: 160 }}>
                
                <Geographies geography={geoUrl}>
            {({ geographies }) =>
                geographies
                .filter((geo) => geo.properties.name !== 'Antarctica') 
                .map((geo) => {
                    const geoId = geo.properties.iso_a3;
                    const isVisited = checkIsVisited(geoId);
                            
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    // Zde voláme funkci pro styly a předáváme informaci o navštívení
                                    style={getGeographyStyle(isVisited)}
                                    

                                    onClick={() => {
                                        console.log(`Kliknuto na: ${geo.properties.name} (${geo.id})`);
                                        console.log(`Navštíveno: ${isVisited ? 'ANO' : 'NE'}`);
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
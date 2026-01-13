import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import '../styles/componentsStyles/DottedMap.scss'; 

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

const DottedMap: React.FC = () => {
  return (
    <div className="dotted-map-container">
      <ComposableMap 
        projectionConfig={{ 
          scale: 260, 
          center: [10, 10] 
        }}
        style={{ width: "100%", height: "100vh" }}
      >
        <defs>
          <pattern id="dots-dark" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#2bc3ff54" />
          </pattern>
        </defs>

        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                tabIndex={-1}
                style={{
                  default: { fill: "url(#dots-dark)", outline: "none" },
                  hover: { fill: "url(#dots-dark)", outline: "none" },
                  pressed: { fill: "url(#dots-dark)", outline: "none" }
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default DottedMap;
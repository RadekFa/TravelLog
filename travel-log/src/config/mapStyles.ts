// Definice barev pro mapu napojená na CSS proměnné
export const mapColors = {
    // 👑 Použijeme CSS proměnné, které za chvíli nadefinujeme ve variables.scss
    default: 'var(--map-country-default)',   // Nenavštívená země
    visited: 'var(--map-country-visited)',   // Navštívená země
    stroke: 'var(--map-country-stroke)',    // Hranice zemí
};

// Funkce zůstává vizuálně stejná, ale díky var() bude dynamická hned od startu
export const getGeographyStyle = (isVisited: boolean) => {
  const baseFill = isVisited ? mapColors.visited : mapColors.default;

  return {
    default: {
      fill: baseFill,
      stroke: mapColors.stroke,
      strokeWidth: 1.2, // Mírně ztenčeno, aby na tmavém pozadí mapy lépe vynikly detaily
      outline: 'none',
      transition: 'fill 0.3s ease, stroke 0.3s ease', // Přidána plynulá změna při přepnutí modu
      cursor: 'default',
    },
    hover: {
      fill: baseFill, 
      stroke: mapColors.stroke,
      strokeWidth: 1.2,
      outline: 'none',
      transition: 'none',
      cursor: 'default', 
    },
    pressed: {
      fill: baseFill, 
      stroke: mapColors.stroke,
      strokeWidth: 1.2,
      outline: 'none',
      transition: 'none',
      cursor: 'default',
    },
  };
};
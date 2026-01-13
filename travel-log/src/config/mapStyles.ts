// Definice barev pro mapu
export const mapColors = {
    default: '#e4e1e1ff',       // Nenavštívená země
    visited: '#2bc3ff',       // Navštívená země (např. SeaGreen)
    stroke: '#FFFFFF',        // Hranice zemí
};

// Funkce, která vrátí styl pro konkrétní zemi na základě toho, zda je navštívená
export const getGeographyStyle = (isVisited: boolean) => {
  const baseFill = isVisited ? mapColors.visited : mapColors.default;

  return {
    default: {
      fill: baseFill,
      stroke: mapColors.stroke,
      strokeWidth: 1.5,
      outline: 'none',
      transition: 'none',
      cursor: 'default',
    },
    hover: {
      fill: baseFill, 
      stroke: mapColors.stroke,
      strokeWidth: 1.5,
      outline: 'none',
      transition: 'none',
      cursor: 'default',
    },
    pressed: {
      fill: baseFill, 
      stroke: mapColors.stroke,
      strokeWidth: 1.5,
      outline: 'none',
      transition: 'none',
      cursor: 'default',
    },
  };
};
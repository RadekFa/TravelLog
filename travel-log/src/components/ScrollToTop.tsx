import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Přesune skrol na úplný začátek (X: 0, Y: 0)
    window.scrollTo(0, 0);
  }, [pathname]); // Spustí se pokaždé, když se změní cesta

  return null; // Komponenta nic nevykresluje
};

export default ScrollToTop;
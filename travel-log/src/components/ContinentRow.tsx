import React, { useRef, useState, useEffect } from "react";
import CountryCard from "./CountryCard";
import "../styles/componentsStyles/ContinentRow.scss";

interface Country {
  name: string;
  continent: string;
  flag: string;
  image?: string;
}

interface ContinentRowProps {
  continent: string;
  countries: Country[];
}

/* ------------------------------------------
   Scroll Arrow Component 
------------------------------------------- */
const ScrollArrow = ({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) => (
  <svg
    className={`scroll-btn ${direction} ${disabled ? "disabled" : ""}`}
    onClick={disabled ? undefined : onClick}
    viewBox="0 0 20 20"
    style={direction === "right" ? { transform: "rotate(180deg)" } : undefined}
  >
    <path
      d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z"
      fill="currentColor"
    />
  </svg>
);

/* ------------------------------------------
   Main Component
------------------------------------------- */
const ContinentRow: React.FC<ContinentRowProps> = ({ continent, countries }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    if (!rowRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;
    const EPS = 2;

    setShowLeft(scrollLeft > EPS);
    setShowRight(scrollLeft < maxScrollLeft - EPS);
  };

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const init = () => checkScroll();
    requestAnimationFrame(init);

    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(row);

    row.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      row.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollBy = (amount: number) => {
    rowRef.current?.scrollTo({
      left: rowRef.current.scrollLeft + amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="continent-section">
      <h2>{continent}</h2>

      <div className="scroll-container">
        {showLeft && (
          <ScrollArrow
            direction="left"
            onClick={() => scrollBy(-600)}
            disabled={!showLeft}
          />
        )}

        <div ref={rowRef} className="country-row">
          {countries.map((country) => (
            <CountryCard
              key={country.name}
              name={country.name}
              continent={country.continent}
              flag={country.flag}
              image={country.image}
            />
          ))}
        </div>

        {showRight && (
          <ScrollArrow
            direction="right"
            onClick={() => scrollBy(600)}
            disabled={!showRight}
          />
        )}
      </div>
    </section>
  );
};

export default ContinentRow;

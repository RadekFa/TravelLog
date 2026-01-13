import React, { useState, useRef, useEffect } from "react";
import "../styles/componentsStyles/DateRangeInput.scss";

type Props = {
  value: { start: Date | null; end: Date | null };
  onChange: (range: { start: Date | null; end: Date | null }) => void;
};

const DateRangeInput: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  // Stav pro posun měsíců (0 = aktuální měsíc založený na dnešku)
  const [currentOffset, setCurrentOffset] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Formátování data podle požadavku: May 10, 2023
  const format = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  /* ----------------------------- */
  /* LOGIKA VÝBĚRU DNŮ (ROZSAH) */
  /* ----------------------------- */
  const handleDayClick = (day: Date) => {
    const { start, end } = value;

    // Pokud není vybrán začátek nebo už je vybrán celý rozsah, začni znovu
    if (!start || (start && end)) {
      onChange({ start: day, end: null });
      return;
    }

    // Pokud vybíráme konec rozsahu
    if (start && !end) {
      if (day < start) {
        // Pokud uživatel klikne na dřívější datum, udělej z něj start
        onChange({ start: day, end: start });
      } else {
        onChange({ start, end: day });
      }
    }
  };

  /* ----------------------------- */
  /* GENEROVÁNÍ MŘÍŽKY KALENDÁŘE */
  /* ----------------------------- */
  const generateCalendar = (monthOffset: number) => {
    const today = new Date();
    // Výpočet cílového měsíce na základě aktuálního posunu (offsetu)
    const targetMonth = today.getMonth() + currentOffset + monthOffset;
    
    const first = new Date(today.getFullYear(), targetMonth, 1);
    const last = new Date(today.getFullYear(), targetMonth + 1, 0);

    const days: Date[] = [];
    for (let i = 1; i <= last.getDate(); i++) {
      days.push(new Date(first.getFullYear(), first.getMonth(), i));
    }

    // Výpočet odsazení pro začátek týdne (Pondělí jako start)
    const weekdayOffset = first.getDay() === 0 ? 6 : first.getDay() - 1;

    const arrowSvg = (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z" />
      </svg>
    );

    return (
      <div className="calendar-month">
        <div className="calendar-header">
          <button 
            className="nav-button prev" 
            onClick={(e) => { e.stopPropagation(); setCurrentOffset(prev => prev - 1); }}
            type="button"
          >
            {arrowSvg}
          </button>

          <h4 className="calendar-title">
            {first.toLocaleString("en-US", { month: "long" })} {first.getFullYear()}
          </h4>

          <button 
            className="nav-button next" 
            onClick={(e) => { e.stopPropagation(); setCurrentOffset(prev => prev + 1); }}
            type="button"
          >
            {arrowSvg}
          </button>
        </div>

        <div className="calendar-grid">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <div key={d} className="calendar-day-name">{d}</div>
          ))}

          {Array(weekdayOffset).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="empty"></div>
          ))}

          {days.map((day) => {
            const { start, end } = value;
            const isSelected = start && end && day >= start && day <= end;
            const isStart = start && day.toDateString() === start.toDateString();
            const isEnd = end && day.toDateString() === end.toDateString();

            return (
              <div
                key={day.toISOString()}
                className={`calendar-day 
                  ${isSelected ? "selected" : ""} 
                  ${isStart ? "start" : ""} 
                  ${isEnd ? "end" : ""}`}
                onClick={() => handleDayClick(day)}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* Zavření při kliknutí mimo komponentu */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="date-range-wrapper" ref={wrapperRef}>
      <input
        className="date-range-input"
        readOnly
        value={
          value.start && value.end 
            ? `${format(value.start)} – ${format(value.end)}` 
            : ""
        }
        placeholder="Select trip range (Month DD, YYYY)"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="calendar-popup">
          {generateCalendar(0)}
          {generateCalendar(1)}
        </div>
      )}
    </div>
  );
};

export default DateRangeInput;
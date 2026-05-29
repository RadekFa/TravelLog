import { render, screen } from "@testing-library/react";
import ProgressBar from "../components/ProgressBar";
import { describe, test, expect, vi } from "vitest";

// OPRAVA: Mock pro LanguageContext, který ProgressBar nyní používá k překladu textů
vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({ t: (key: string) => key })
}));

describe("ProgressBar (ukazatel pokroku)", () => {
  test("vykreslí text cestovatelského cíle", () => {
    // OPRAVA: Přidány chybějící povinné parametry (props)
    render(<ProgressBar visitedCount={5} travelGoal={20} />);
    
    // Očekáváme překladový klíč, který nám vyhodí náš namockovaný překladač
    expect(screen.getByText(/progress_bar.goal_title/i)).toBeInTheDocument();
  });

  test("vykreslí počet navštívených zemí ve správném formátu", () => {
    // OPRAVA: Přidány chybějící povinné parametry (props)
    render(<ProgressBar visitedCount={5} travelGoal={20} />);
    
    // Test projde, protože bude přesně vědět, že má vypsat hodnoty 5 a 20 z parametrů
    expect(screen.getByText(/5\/20/i)).toBeInTheDocument();
  });
});
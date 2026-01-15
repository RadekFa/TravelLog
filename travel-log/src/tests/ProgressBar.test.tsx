import { render, screen } from "@testing-library/react";
import ProgressBar from "../components/ProgressBar";
import { describe, test, expect } from "vitest";

describe("ProgressBar (ukazatel pokroku)", () => {
  test("vykreslí text cestovatelského cíle", () => {
    render(<ProgressBar />);
    expect(screen.getByText(/Travel Goal/i)).toBeInTheDocument();
  });

  test("vykreslí počet navštívených zemí ve správném formátu", () => {
    render(<ProgressBar />);
    
    // Hledáme konkrétní řetězec, který obsahuje formát "číslo/číslo countries"
    // To prokazuje správné zpracování a zobrazení dat 
    expect(screen.getByText(/\d+\/\d+ countries/i)).toBeInTheDocument();
  });
});
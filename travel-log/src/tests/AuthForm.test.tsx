import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "../components/AuthForm";
import { describe, test, expect, vi } from "vitest";

// Mockování kontextu a routeru, aby komponenta při běhu testů nepadala
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() })
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

// BLOK 1: PŘIHLÁŠENÍ (3 testy)
describe("AuthForm (režim přihlášení)", () => {
  test("vykreslí pole pro email a heslo", () => {
    // OPRAVA: Změněno onSubmit na toggleAuth
    render(<AuthForm isLogin={true} toggleAuth={vi.fn()} />);
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/^Password$/i)).toBeInTheDocument();
  });

  test("nevykreslí pole pro jméno a potvrzení hesla v režimu přihlášení", () => {
    // OPRAVA: Změněno onSubmit na toggleAuth
    render(<AuthForm isLogin={true} toggleAuth={vi.fn()} />);
    expect(screen.queryByText(/Full Name/i)).toBeNull();
    expect(screen.queryByText(/Confirm Password/i)).toBeNull();
  });

  test("zobrazí chybu validace pro prázdné heslo", async () => {
    // OPRAVA: Změněno onSubmit na toggleAuth
    render(<AuthForm isLogin={true} toggleAuth={vi.fn()} />);
    fireEvent.submit(screen.getByRole("button", { name: /Log In/i }));
    
    // Očekáváme novou hlášku "Required.", stará ("6 characters") byla z loginu odstraněna
    await waitFor(() => {
      expect(screen.getAllByText(/Required\./i).length).toBeGreaterThan(0);
    });
  });
});

// BLOK 2: REGISTRACE (2 testy)
describe("AuthForm (režim registrace)", () => {
  test("vykreslí všechna pole potřebná pro registraci (Krok 1)", async () => {
    // OPRAVA: Změněno onSubmit na toggleAuth
    render(<AuthForm isLogin={false} toggleAuth={vi.fn()} />);
    expect(await screen.findByText(/Email Address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Confirm Password/i)).toBeInTheDocument();
  });

  test("zobrazí chybu, pokud se zadaná hesla neshodují", async () => {
    // OPRAVA: Změněno onSubmit na toggleAuth
    render(<AuthForm isLogin={false} toggleAuth={vi.fn()} />);
    
    // Hledáme pomocí placeholeru, jelikož label je oddělen od inputu
    const inputs = await screen.findAllByPlaceholderText(/••••••••/i);
    const passwordInput = inputs[0]; 
    const confirmInput = inputs[1];  
    
    fireEvent.change(passwordInput, { target: { value: "Heslo123" } });
    fireEvent.change(confirmInput, { target: { value: "Jineheslo123" } });
    
    // U registrace musíš kliknout na 'Continue', aby se spustila validace kroku 1
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });
  });
});
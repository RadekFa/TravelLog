import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "../components/AuthForm";
import { describe, test, expect, vi } from "vitest";
import { AlertToastProvider } from "../context/AlertToastContext";

// Mockování kontextu a routeru
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() })
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

// Wrapper, který obalí komponentu do provideru potřebného pro hooky
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AlertToastProvider>
      {children}
    </AlertToastProvider>
  );
};

const customRender = (ui: React.ReactElement) => {
  return render(ui, { wrapper: AllTheProviders });
};

// BLOK 1: PŘIHLÁŠENÍ (3 testy)
describe("AuthForm (režim přihlášení)", () => {
  test("vykreslí pole pro email a heslo", () => {
    customRender(<AuthForm isLogin={true} toggleAuth={vi.fn()} />);
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/^Password$/i)).toBeInTheDocument();
  });

  test("nevykreslí pole pro jméno a potvrzení hesla v režimu přihlášení", () => {
    customRender(<AuthForm isLogin={true} toggleAuth={vi.fn()} />);
    expect(screen.queryByText(/Full Name/i)).toBeNull();
    expect(screen.queryByText(/Confirm Password/i)).toBeNull();
  });

  test("zobrazí chybu validace pro prázdné heslo", async () => {
    const { container } = customRender(<AuthForm isLogin={true} toggleAuth={vi.fn()} />);
    
    // Používáme querySelector pro cílený výběr submit tlačítka podle CSS třídy
    const submitButton = container.querySelector('.submit-btn') as HTMLElement;
    fireEvent.click(submitButton); 
    
    await waitFor(() => {
      expect(screen.getAllByText(/Required\./i).length).toBeGreaterThan(0);
    });
  });
});

// BLOK 2: REGISTRACE (2 testy)
describe("AuthForm (režim registrace)", () => {
  test("vykreslí všechna pole potřebná pro registraci (Krok 1)", async () => {
    customRender(<AuthForm isLogin={false} toggleAuth={vi.fn()} />);
    expect(await screen.findByText(/Email Address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Confirm Password/i)).toBeInTheDocument();
  });

  test("zobrazí chybu, pokud se zadaná hesla neshodují", async () => {
    customRender(<AuthForm isLogin={false} toggleAuth={vi.fn()} />);
    
    const inputs = await screen.findAllByPlaceholderText(/••••••••/i);
    const passwordInput = inputs[0]; 
    const confirmInput = inputs[1];  
    
    fireEvent.change(passwordInput, { target: { value: "Heslo123" } });
    fireEvent.change(confirmInput, { target: { value: "Jineheslo123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });
  });
});
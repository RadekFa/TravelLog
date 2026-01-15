import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "../components/AuthForm";
import { describe, test, expect, vi } from "vitest";

// BLOK 1: PŘIHLÁŠENÍ (3 testy)
describe("AuthForm (režim přihlášení)", () => {
  test("vykreslí pole pro email a heslo", () => {
    render(<AuthForm isLogin={true} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
  });

  test("nevykreslí pole pro jméno a potvrzení hesla v režimu přihlášení", () => {
    render(<AuthForm isLogin={true} onSubmit={vi.fn()} />);
    expect(screen.queryByLabelText(/Full Name/i)).toBeNull();
    expect(screen.queryByLabelText(/Confirm Password/i)).toBeNull();
  });

  test("zobrazí chybu validace pro příliš krátké heslo", async () => {
    render(<AuthForm isLogin={true} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123" } });
    fireEvent.submit(screen.getByRole("button"));
    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
  });
});

// BLOK 2: REGISTRACE (2 testy)
describe("AuthForm (režim registrace)", () => {
  test("vykreslí všechna pole potřebná pro registraci", async () => {
    render(<AuthForm isLogin={false} onSubmit={vi.fn()} />);
    expect(await screen.findByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  test("zobrazí chybu, pokud se zadaná hesla neshodují", async () => {
    render(<AuthForm isLogin={false} onSubmit={vi.fn()} />);
    const passwordInput = await screen.findByLabelText(/^Password$/i);
    const confirmInput = await screen.findByLabelText(/Confirm Password/i);
    
    fireEvent.change(passwordInput, { target: { value: "heslo123" } });
    fireEvent.change(confirmInput, { target: { value: "jineheslo" } });
    fireEvent.submit(screen.getByRole("button", { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
    });
  });
});
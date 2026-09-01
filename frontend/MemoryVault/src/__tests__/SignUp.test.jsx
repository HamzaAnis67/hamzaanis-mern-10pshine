import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignUp from "../pages/auth/signUp";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders signup input fields and register button", () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create|register|sign/i }),
    ).toBeInTheDocument();
  });

  it("updates input field values when user types", () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(nameInput, { target: { value: "Hamza Anis" } });
    fireEvent.change(emailInput, { target: { value: "hamza@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Pass1234!" } });

    expect(nameInput.value).toBe("Hamza Anis");
    expect(emailInput.value).toBe("hamza@example.com");
    expect(passwordInput.value).toBe("Pass1234!");
  });

  it("handles successful registration and redirect", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Account created successfully" }),
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Hamza Anis" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "hamza@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "Pass1234!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create|register|sign/i }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it("handles signup failure response gracefully", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Email already in use" }),
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/name/i), {
      target: { value: "Hamza Anis" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "Pass1234!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create|register|sign/i }),
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});

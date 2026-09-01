import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../components/Header";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders MemoVault logo, search, and user info by default", () => {
    localStorage.setItem("username", JSON.stringify("hamzaanis"));

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    expect(screen.getAllByText(/MemoVault/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("hamzaanis").length).toBeGreaterThan(0);
    expect(screen.getAllByPlaceholderText(/search/i).length).toBe(2);
    expect(screen.getAllByRole("button", { name: /logout/i }).length).toBe(2);
  });

  it("hides search and logout when sec_div and third_div are true", () => {
    render(
      <BrowserRouter>
        <Header sec_div={true} third_div={true} />
      </BrowserRouter>,
    );

    expect(screen.getAllByText(/MemoVault/i).length).toBeGreaterThan(0);
    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  it("triggers onSearch prop when search input changes", () => {
    const mockOnSearch = jest.fn();
    render(
      <BrowserRouter>
        <Header onSearch={mockOnSearch} />
      </BrowserRouter>,
    );

    const [desktopSearch] = screen.getAllByPlaceholderText(/search/i);
    fireEvent.change(desktopSearch, { target: { value: "Architecture" } });

    expect(mockOnSearch).toHaveBeenCalledWith("Architecture");
  });

  it("handles successful logout flow and redirects to login", async () => {
    jest.useFakeTimers();
    localStorage.setItem("username", JSON.stringify("hamzaanis"));

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Logged out successfully" }),
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const [logoutButton] = screen.getAllByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/logout"),
        expect.objectContaining({ method: "POST" }),
      );
    });

    expect(localStorage.getItem("username")).toBeNull();

    // Fast-forward the 2000ms setTimeout redirect
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    jest.useRealTimers();
  });

  it("handles API error message on logout", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Session expired" }),
    });

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const [logoutButton] = screen.getAllByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("handles network failure on logout catch block", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network Error"));

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const [logoutButton] = screen.getAllByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "logout error :",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });
});

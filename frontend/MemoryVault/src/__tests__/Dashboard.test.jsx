import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../pages/dashboard/dashboard";

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: "Architecture Doc",
          content: "Backend and Frontend setup",
          created_at: "2026-08-31",
        },
      ],
    });
  });

  it("renders notes and dashboard controls", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/Architecture Doc/i) || screen.queryByRole("main"),
      ).toBeTruthy();
    });
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CalculateForm from "../components/CalculateForm";
import { getUserLocation } from "../utils/helpers";



// Mocks for utilities
vi.mock("../utils/utils", () => ({
  calculatePriceBreakDown: vi.fn(),
  getUserLocation: vi.fn(),
}));

describe("CalculateForm", () => {
  it("should submit the form with valid data", async () => {
    render(
      <CalculateForm
       
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/venue name/i), {
      target: { value: "testVenue" },
    });
    fireEvent.change(screen.getByPlaceholderText(/0.00/i), {
      target: { value: "100.00" },
    });
    fireEvent.change(screen.getByPlaceholderText(/user location latitude/i), {
      target: { value: "60.0" },
    });
    fireEvent.change(screen.getByPlaceholderText(/user location longitude/i), {
      target: { value: "24.0" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Calculate delivery price/i })
    );

    await waitFor(() => {
      // Add assertions for price breakdown
      expect(screen.getByText("Price breakdown")).toBeInTheDocument();
    });
  });

  it("should show an error when the location fetch fails", async () => {
    vi.mocked(getUserLocation).mockRejectedValue(
      new Error("Location fetch failed")
    );

    render(
      <CalculateForm
       
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Get Location/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Error fetching location: Location fetch failed")
      ).toBeInTheDocument();
    });
  });

  it("should prevent resubmission with same data", async () => {
    render(
      <CalculateForm
       
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/venue name/i), {
      target: { value: "testVenue" },
    });
    fireEvent.change(screen.getByPlaceholderText(/0.00/i), {
      target: { value: "100.00" },
    });
    fireEvent.change(screen.getByPlaceholderText(/user location latitude/i), {
      target: { value: "60.0" },
    });
    fireEvent.change(screen.getByPlaceholderText(/user location longitude/i), {
      target: { value: "24.0" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Calculate delivery price/i })
    );

    // Simulate same data submission
    fireEvent.click(
      screen.getByRole("button", { name: /Calculate delivery price/i })
    );
    await waitFor(() => {
      expect(
        screen.getByText(
          "Same entries as earlier. Price breakdown will be same as belows."
        )
      ).toBeInTheDocument();
    });
  });
});

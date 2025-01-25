//libraries
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

//helpers
import { getUserLocation, calculatePriceBreakDown } from "../utils/helpers";

//components
import CalculatorForm from "../components/CalculatorForm";

// Mocks for utilities
vi.mock("../utils/helpers", () => ({
  getUserLocation: vi.fn(),
  calculatePriceBreakDown: vi.fn(),
}));

describe("CalculateForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  //1.
  it("should render all input fields and buttons", () => {
    render(<CalculatorForm />);
    //  form heading
    expect(
      screen.getByText(/Delivery Order Price Calculator/i)
    ).toBeInTheDocument();

    // input fields
    expect(screen.getByTestId("venueSlug")).toBeInTheDocument();
    expect(screen.getByTestId("cartValue")).toBeInTheDocument();
    expect(screen.getByTestId("userLatitude")).toBeInTheDocument();
    expect(screen.getByTestId("userLongitude")).toBeInTheDocument();

    // buttons
    expect(
      screen.getByRole("button", { name: "get user location co-ordinates" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "calculate delivery price breakdown" })
    ).toBeInTheDocument();
  });

  //2.
  it("should show validation errors when required fields are empty", async () => {
    render(<CalculatorForm />);
    const button = screen.getByLabelText("calculate delivery price breakdown");
    fireEvent.click(button);

    await waitFor(() => {
      // venueSlug--- default value now--todo//--
      expect(
        screen.getByText(
          /Cart value must be a positive number with up to 2 decimal places./i
        )
      ).toBeInTheDocument();
      expect(screen.getByText(/Latitude is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Longitude is required/i)).toBeInTheDocument();
    });
  });

  //3.
  it("should show an error when the location fetch fails", async () => {
    render(<CalculatorForm />);
    vi.mocked(getUserLocation).mockRejectedValue("User denied Geolocation");
    fireEvent.click(
      screen.getByRole("button", { name: "get user location co-ordinates" })
    );
    await waitFor(() => {
      expect(
        screen.getByText(/Error fetching location: User denied Geolocation/i)
      ).toBeInTheDocument();
    });
  });

  //4.
  it("should update latitude and longitude on successful fetch", async () => {
    // Mock getUserLocation to resolve with values
    vi.mocked(getUserLocation).mockResolvedValue({
      userLatitude: 60,
      userLongitude: 24,
    });
    render(<CalculatorForm />);
    fireEvent.click(
      screen.getByRole("button", { name: "get user location co-ordinates" })
    );
    await waitFor(() => {
      expect(screen.getByTestId("userLatitude")).toHaveValue(60);
      expect(screen.getByTestId("userLongitude")).toHaveValue(24);
    });
    // when complete 
    expect(
      screen.queryByText(/error fetching location/i)
    ).not.toBeInTheDocument();
  });

  //5.
  it("should not render PriceBreakdown if priceBreakdown is null", () => {
    render(<CalculatorForm />);
    expect(screen.queryByText("Price Breakdown")).not.toBeInTheDocument();
  });

  //6.
  it("should submit the form with input values and render PriceBreakdown with correct values when priceBreakdown is set correctly", async () => {
    render(<CalculatorForm />);

    // Enter data into the form fields
    fireEvent.change(screen.getByTestId("venueSlug"), {
      target: { value: "example-venue-slug" },
    });
    fireEvent.change(screen.getByTestId("cartValue"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByTestId("userLatitude"), {
      target: { value: "60" },
    });
    fireEvent.change(screen.getByTestId("userLongitude"), {
      target: { value: "24" },
    });

    // submit
    fireEvent.click(
      screen.getByRole("button", {
        name: "calculate delivery price breakdown",
      })
    );

    // mock response data
    vi.mocked(calculatePriceBreakDown).mockResolvedValue({
      cartValue: 500,
      distance: 100,
      deliveryFee: 190,
      smallOrderSurcharge: 500,
      totalPrice: 1190,
    });

    //  check if submitted with the actual form data
    await waitFor(() => {
      expect(calculatePriceBreakDown).toHaveBeenCalledTimes(1);
      expect(calculatePriceBreakDown).toHaveBeenCalledWith(
        "example-venue-slug",
        5,
        60,
        24
      );
    });

    // Wait for the breakdown to be displayed
    const priceBreakdownHeading = await screen.findByText("Price Breakdown");
    expect(priceBreakdownHeading).toBeInTheDocument();

//  In calculatorForm component (repeated as well in pricebreakdown component)
    expect(screen.getByTestId("resultCartValue")).toHaveAttribute(
      "data-raw-value",
      "500"
    );
    expect(screen.getByTestId("distance")).toHaveAttribute(
      "data-raw-value",
      "100"
    );

    expect(screen.getByTestId("deliveryFee")).toHaveAttribute(
      "data-raw-value",
      "190"
    );

    expect(screen.getByTestId("smallOrderSurcharge")).toHaveAttribute(
      "data-raw-value",
      "500"
    );

    expect(screen.getByTestId("totalPrice")).toHaveAttribute(
      "data-raw-value",
      "1190"
    );
  });
});

//todo
//


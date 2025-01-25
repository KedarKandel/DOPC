// libraries
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it,} from "vitest";

//types
import { PriceBreakdownType } from "../utils/types";

//components
import PriceBreakDown from "../components/PriceBreakDown";

describe("PriceBreakDown", () => {
  afterEach(() => {
    cleanup();
  });

  it("should not display anything if priceBreakdown is null", () => {
    render(<PriceBreakDown priceBreakdown={null} />);
    expect(screen.queryByText("Price Breakdown")).not.toBeInTheDocument();
  });

  //Mock pricebreakdown values 
  const MockpriceBreakdown: PriceBreakdownType = {
    cartValue: 500, // in cents
    distance: 1000, // in meters
    deliveryFee: 190, // in cents
    smallOrderSurcharge: 500, // in cents
    totalPrice: 1190, // in cents
  };

  it("should render the PriceBreakdown component if not null", async () => {
    render(<PriceBreakDown priceBreakdown={MockpriceBreakdown} />);
    expect(screen.getByText(/Price Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Cart Value:/i)).toBeInTheDocument();
    expect(screen.getByText(/Distance:/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery Fee:/i)).toBeInTheDocument();
    expect(screen.getByText(/Small Order Surcharge:/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Price:/i)).toBeInTheDocument();
  });

  it("should display correct price breakdown values with data-raw-value", () => {
    render(<PriceBreakDown priceBreakdown={MockpriceBreakdown} />);

    // cart value
    const resultCartValue = screen.getByTestId("resultCartValue");
    expect(resultCartValue).toHaveAttribute("data-raw-value", "500");
    expect(resultCartValue).toHaveTextContent("5,00 €");

    //distance
    const distance = screen.getByTestId("distance");
    expect(distance).toHaveAttribute("data-raw-value", "1000");
    expect(distance).toHaveTextContent("1000 m");

    //delieveryFee
    const deliveryFee = screen.getByTestId("deliveryFee");
    expect(deliveryFee).toHaveAttribute("data-raw-value", "190");
    expect(deliveryFee).toHaveTextContent("1,90 €");

    //smallOrderSurcharge
    const smallOrderSurcharge = screen.getByTestId("smallOrderSurcharge");
    expect(smallOrderSurcharge).toHaveAttribute("data-raw-value", "500");
    expect(smallOrderSurcharge).toHaveTextContent("5,00 €");

    //totalPrice
    const totalPrice = screen.getByTestId("totalPrice");
    expect(totalPrice).toHaveAttribute("data-raw-value", "1190");
    expect(totalPrice).toHaveTextContent("11,90 €");
  });
});

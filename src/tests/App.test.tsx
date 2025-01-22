import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";


describe("App Component", () => {
  it("renders the wolt logo text and CalculateForm component", () => {
    render(<App />);
    expect(screen.getByText("Wolt")).toBeInTheDocument();
    expect(
      screen.getByText("Delivery Order Price Calculator")
    ).toBeInTheDocument();
  });
});

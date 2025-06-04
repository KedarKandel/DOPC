
//libraries
import {
  render,
  screen,
  cleanup,
  fireEvent,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

//components
import CalculateBtn from "../components/CalculateBtn";
import CalculateForm from "../components/CalculatorForm";


describe("CalculateBtn", () => {
  afterEach(() => {
    cleanup();
  });

//1.
  it("should render the button 'Calculate delivery price' ",  () => {
    render(<CalculateBtn isSubmitting={false} />);
    const button =  screen.getByRole("button", {
      name: "calculate delivery price breakdown",
    });
    expect(button).toBeInTheDocument();
  });


//2.
  it("should render 'Calculating...' when submitting", () => {
    render(<CalculateBtn isSubmitting={true} />);
    const button = screen.getByRole("button", {
      name: "calculate delivery price breakdown",
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Calculating...");
  });


//3.
  it("should be disabled when isSubmitting is true", () => {
    render(<CalculateBtn isSubmitting={true} />);
    const button = screen.getByRole("button", {
      name: "calculate delivery price breakdown",
    });
    expect(button).toBeDisabled();
  });


//4.
  it("should be enabled when isSubmitting is false", () => {
    render(<CalculateBtn isSubmitting={false} />);
    const button = screen.getByRole("button", {
      name: "calculate delivery price breakdown",
    });
    expect(button).not.toBeDisabled();
  });


//5.
  it("should call onsubmit when clicked after data is entered", () => {
    const handleSubmitMock = vi.fn();
    const { container } = render(<CalculateForm />);
    const form = container.querySelector("form");
    if (form) {
      form.onsubmit = handleSubmitMock;
    }
    fireEvent.click(
      screen.getByRole("button", { name: "calculate delivery price breakdown" })
    );
    expect(handleSubmitMock).toHaveBeenCalledTimes(1);
  });
});

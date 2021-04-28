import { render, screen, fireEvent } from "@testing-library/react";
import Confirmation from "./Confirmation";

describe("Confirmation", () => {
  it("should render confirmation", async () => {
    const mockFn = jest.fn();
    render(<Confirmation message="Test message" onConfirm={mockFn} />);

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    expect(confirmButton).toBeInTheDocument();
  });

  it("should call onConfirm when confirm", async () => {
    const mockFn = jest.fn();
    render(<Confirmation message="Test message" onConfirm={mockFn} />);

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    fireEvent.click(confirmButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import DeleteConfirmation from "./DeleteConfirmation";

describe("Delete Confirmation", () => {
  it("should call onConfirm when click Confirm button", async () => {
    const mockFn = jest.fn();
    render(<DeleteConfirmation onConfirm={mockFn} />);

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    fireEvent.click(confirmButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

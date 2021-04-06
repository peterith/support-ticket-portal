import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal", () => {
  it("should display ticket table and total tickets", async () => {
    render(
      <Modal heading="Create ticket" onClose={jest.fn()}>
        <div data-testid="test" />
      </Modal>
    );

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("Create ticket");

    const content = screen.getByTestId("test");
    expect(content).toBeInTheDocument();
  });

  it("should call onClose when click on close button", async () => {
    const mockFn = jest.fn();
    render(
      <Modal heading="Create ticket" onClose={mockFn}>
        <div data-testid="test" />
      </Modal>
    );

    const closeButton = screen.getByRole("button", { name: "close" });
    fireEvent.click(closeButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
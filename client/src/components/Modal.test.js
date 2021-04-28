import { render, screen, fireEvent, within } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal", () => {
  it("should render modal", async () => {
    render(
      <Modal heading="Create ticket" onClose={jest.fn()}>
        <div data-testid="test" />
      </Modal>
    );

    const modal = screen.getByRole("dialog");

    const heading = within(modal).getByRole("heading");
    expect(heading).toHaveTextContent("Create ticket");

    const content = within(modal).getByTestId("test");
    expect(content).toBeInTheDocument();
  });

  it("should call onClose when close modal", async () => {
    const mockFn = jest.fn();
    render(
      <Modal heading="Create ticket" onClose={mockFn}>
        <div data-testid="test" />
      </Modal>
    );

    const modal = screen.getByRole("dialog");
    const closeButton = within(modal).getByRole("button", { name: "close" });
    fireEvent.click(closeButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

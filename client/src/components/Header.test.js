import { render, screen, fireEvent, within } from "@testing-library/react";
import Header from "./Header";
import { ModalProvider } from "../context/ModalContext";

describe("Header", () => {
  const appRoot = document.createElement("div");
  appRoot.id = "app-root";
  const modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  const container = document.createElement("div");
  container.append(appRoot, modalRoot);

  it("should display header with create button", async () => {
    render(
      <ModalProvider>
        <Header onCreateTicket={jest.fn()} />
      </ModalProvider>
    );

    const header = screen.getByRole("banner");
    const createButton = within(header).getByRole("button", { name: "Create" });
    expect(createButton).toBeInTheDocument();
  });

  it("should call onCreateTicket when click on create button and fill form", async () => {
    const mockFn = jest.fn();
    render(
      <ModalProvider>
        <Header onCreateTicket={mockFn} />
      </ModalProvider>,
      { container: document.body.appendChild(container).firstChild }
    );

    const header = screen.getByRole("banner");
    const createButton = within(header).getByRole("button", { name: "Create" });
    fireEvent.click(createButton);

    const createTicketForm = screen.getByRole("dialog", {
      name: "Create ticket",
    });

    const titleField = within(createTicketForm).getByLabelText("Title");
    fireEvent.change(titleField, { target: { value: "Title 1" } });

    const descriptionField = within(createTicketForm).getByLabelText(
      "Description"
    );
    fireEvent.change(descriptionField, { target: { value: "Description 1" } });

    const authorField = within(createTicketForm).getByLabelText("Author");
    fireEvent.change(authorField, { target: { value: "John Doe" } });

    const submitButton = within(createTicketForm).getByRole("button", {
      name: "Create",
    });
    fireEvent.click(submitButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

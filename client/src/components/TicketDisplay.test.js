import { render, screen, fireEvent, within } from "@testing-library/react";
import TicketDisplay from "./TicketDisplay";
import { ModalProvider } from "../context/ModalContext";
import { StatusEnum, CategoryEnum, PriorityEnum } from "../enums";

describe("Ticket Display", () => {
  const appRoot = document.createElement("div");
  appRoot.id = "app-root";
  const modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  const container = document.createElement("div");
  container.append(appRoot, modalRoot);

  const ticket = {
    id: 1,
    title: "Ticket 1",
    description: "Description 1",
    status: StatusEnum.OPEN,
    category: CategoryEnum.BUG,
    priority: PriorityEnum.MEDIUM,
    author: "John Doe",
    agent: "Joe Bloggs",
    createdAt: "2020-01-01T00:00:00",
    updatedAt: "2020-01-02T00:00:00",
  };

  it("should render ticket display", () => {
    render(
      <ModalProvider>
        <TicketDisplay
          ticket={ticket}
          onClose={jest.fn()}
          onDelete={jest.fn()}
        />
      </ModalProvider>
    );

    const article = screen.getByRole("article", { name: "Ticket 1" });

    const heading = within(article).getByRole("heading", { name: "Ticket 1" });
    expect(heading).toBeInTheDocument();

    const descriptionField = within(article).getByLabelText("Description");
    expect(descriptionField).toHaveTextContent("Description 1");

    const idField = within(article).getByLabelText("ID");
    expect(idField).toHaveTextContent("1");

    const statusField = within(article).getByLabelText("Status");
    expect(statusField).toHaveTextContent("Open");

    const categoryField = within(article).getByLabelText("Category");
    expect(categoryField).toHaveTextContent("BUG");

    const priorityField = within(article).getByLabelText("Priority");
    const mediumPriority = within(article).getByRole("img", {
      name: "medium priority",
    });
    expect(priorityField).toContainElement(mediumPriority);

    const authorField = within(article).getByLabelText("Author");
    expect(authorField).toHaveTextContent("John Doe");

    const agentField = within(article).getByLabelText("Agent");
    expect(agentField).toHaveTextContent("Joe Bloggs");

    const createdField = within(article).getByLabelText("Created");
    expect(createdField).toHaveTextContent("1/1/2020, 12:00:00 AM");

    const modifiedField = within(article).getByLabelText("Modified");
    expect(modifiedField).toHaveTextContent("1/2/2020, 12:00:00 AM");
  });

  it("should call onClose when click on close button", () => {
    const mockFn = jest.fn();
    render(
      <ModalProvider>
        <TicketDisplay ticket={ticket} onClose={mockFn} onDelete={jest.fn()} />
      </ModalProvider>
    );

    const closeButton = screen.getByRole("button", { name: "close" });
    fireEvent.click(closeButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should call onDelete when click on delete button and confirm button", () => {
    const mockFn = jest.fn();
    render(
      <ModalProvider>
        <TicketDisplay ticket={ticket} onClose={jest.fn()} onDelete={mockFn} />
      </ModalProvider>,
      { container: document.body.appendChild(container).firstChild }
    );
    const deleteButton = screen.getByRole("button", { name: "delete" });
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    fireEvent.click(confirmButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

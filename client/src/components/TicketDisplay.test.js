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
          onUpdateDescription={jest.fn()}
          onUpdateStatus={jest.fn()}
          onUpdateCategory={jest.fn()}
          onUpdatePriority={jest.fn()}
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
    expect(createdField).toBeInTheDocument();

    const modifiedField = within(article).getByLabelText("Modified");
    expect(modifiedField).toBeInTheDocument();
  });

  it("should call onClose when click on close button", () => {
    const mockFn = jest.fn();
    render(
      <ModalProvider>
        <TicketDisplay
          ticket={ticket}
          onClose={mockFn}
          onDelete={jest.fn()}
          onUpdateDescription={jest.fn()}
          onUpdateStatus={jest.fn()}
          onUpdateCategory={jest.fn()}
          onUpdatePriority={jest.fn()}
        />
      </ModalProvider>
    );

    const closeButton = screen.getByRole("button", { name: "close" });
    fireEvent.click(closeButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should call onDelete when click when delete ticket", () => {
    const mockFn = jest.fn();
    render(
      <ModalProvider>
        <TicketDisplay
          ticket={ticket}
          onClose={jest.fn()}
          onDelete={mockFn}
          onUpdateDescription={jest.fn()}
          onUpdateStatus={jest.fn()}
          onUpdateCategory={jest.fn()}
          onUpdatePriority={jest.fn()}
        />
      </ModalProvider>,
      { container: document.body.appendChild(container).firstChild }
    );

    const deleteButton = screen.getByRole("button", { name: "delete" });
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    fireEvent.click(confirmButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(ticket);
  });

  it("should call onUpdateDescription when update description", async () => {
    const mockFn = jest.fn();
    render(
      <ModalProvider>
        <TicketDisplay
          ticket={ticket}
          onClose={jest.fn()}
          onDelete={jest.fn()}
          onUpdateDescription={mockFn}
          onUpdateStatus={jest.fn()}
          onUpdateCategory={jest.fn()}
          onUpdatePriority={jest.fn()}
        />
      </ModalProvider>
    );

    const descriptionButton = screen.getByRole("button", {
      name: "Description",
    });
    fireEvent.click(descriptionButton);

    const descriptionField = screen.getByRole("textbox", {
      name: "Description",
    });
    fireEvent.change(descriptionField, {
      target: { value: "New Description 1" },
    });
    fireEvent.blur(descriptionField);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("New Description 1");
  });

  it("should call onUpdateStatus when update status", async () => {
    const mockFn = jest.fn();
    render(
      <ModalProvider>
        <TicketDisplay
          ticket={ticket}
          onClose={jest.fn()}
          onDelete={jest.fn()}
          onUpdateDescription={jest.fn()}
          onUpdateStatus={mockFn}
          onUpdateCategory={jest.fn()}
          onUpdatePriority={jest.fn()}
        />
      </ModalProvider>
    );

    const statusButton = screen.getByRole("button", { name: "Status" });
    fireEvent.click(statusButton);

    const statuses = screen.getByRole("listbox", { name: "Status" });
    const resolvedStatus = within(statuses).getByText("Resolved");
    fireEvent.click(resolvedStatus);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(StatusEnum.RESOLVED);
  });

  it("should call onUpdateCategory when update category", async () => {
    const mockFn = jest.fn();
    render(
      <ModalProvider>
        <TicketDisplay
          ticket={ticket}
          onClose={jest.fn()}
          onDelete={jest.fn()}
          onUpdateDescription={jest.fn()}
          onUpdateStatus={jest.fn()}
          onUpdateCategory={mockFn}
          onUpdatePriority={jest.fn()}
        />
      </ModalProvider>
    );

    const categoryButton = screen.getByRole("button", { name: "Category" });
    fireEvent.click(categoryButton);

    const categories = screen.getByRole("listbox", { name: "Category" });
    const technicalIssueCategory = within(categories).getByText(
      "Technical Issue"
    );
    fireEvent.click(technicalIssueCategory);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(CategoryEnum.TECHNICAL_ISSUE);
  });

  it("should call onUpdatePriority when update priority", async () => {
    const mockFn = jest.fn();
    render(
      <ModalProvider>
        <TicketDisplay
          ticket={ticket}
          onClose={jest.fn()}
          onDelete={jest.fn()}
          onUpdateDescription={jest.fn()}
          onUpdateStatus={jest.fn()}
          onUpdateCategory={jest.fn()}
          onUpdatePriority={mockFn}
        />
      </ModalProvider>
    );

    const priorityButton = screen.getByRole("button", { name: "Priority" });
    fireEvent.click(priorityButton);

    const categories = screen.getByRole("listbox", { name: "Priority" });
    const highPriority = within(categories).getByText("High");
    fireEvent.click(highPriority);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(PriorityEnum.HIGH);
  });
});

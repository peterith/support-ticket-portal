import { MemoryRouter, Route } from "react-router-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Main from "./Main";
import { ModalProvider } from "../context/ModalContext";
import { StatusEnum, CategoryEnum, PriorityEnum } from "../enums";

describe("Main", () => {
  const appRoot = document.createElement("div");
  appRoot.id = "app-root";
  const modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  const container = document.createElement("div");
  container.append(appRoot, modalRoot);

  const tickets = [
    {
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
    },
    {
      id: 2,
      title: "Ticket 2",
      description: "Description 2",
      status: StatusEnum.IN_PROGRESS,
      category: CategoryEnum.FEATURE_REQUEST,
      priority: PriorityEnum.HIGH,
      author: "Jane Doe",
      agent: "Joe Schmoe",
      createdAt: "2020-01-03T00:00:00",
      updatedAt: "2020-01-04T00:00:00",
    },
  ];

  it("should display ticket table and total tickets", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <ModalProvider>
          <Route exact path={["/tickets", "/tickets/:id"]}>
            <Main tickets={tickets} onDeleteTicket={jest.fn()} />
          </Route>
        </ModalProvider>
      </MemoryRouter>
    );

    const table = screen.getByRole("table");
    const [head, body] = within(table).getAllByRole("rowgroup");
    const headers = within(head).getAllByRole("columnheader");
    const rows = within(body).getAllByRole("row");
    const ticket1 = within(rows[0]).getAllByRole("cell");
    const ticket2 = within(rows[1]).getAllByRole("cell");

    expect(headers[0]).toHaveTextContent("ID");
    expect(headers[1]).toHaveTextContent("Title");
    expect(headers[2]).toHaveTextContent("Status");
    expect(headers[3]).toHaveTextContent("Category");
    expect(headers[4]).toHaveTextContent("Priority");

    expect(ticket1[0]).toHaveTextContent("1");
    expect(ticket1[1]).toHaveTextContent("Ticket 1");
    expect(ticket1[2]).toHaveTextContent("Open");
    expect(ticket1[3]).toHaveTextContent("BUG");

    const mediumPriority = within(ticket1[4]).getByRole("img", {
      name: "medium priority",
    });
    expect(ticket1[4]).toContainElement(mediumPriority);

    expect(ticket2[0]).toHaveTextContent("2");
    expect(ticket2[1]).toHaveTextContent("Ticket 2");
    expect(ticket2[2]).toHaveTextContent("In Progress");
    expect(ticket2[3]).toHaveTextContent("FEATURE REQUEST");

    const highPriority = within(ticket2[4]).getByRole("img", {
      name: "high priority",
    });
    expect(ticket2[4]).toContainElement(highPriority);

    const totalTickets = screen.getByLabelText("Total tickets:");
    expect(totalTickets).toHaveTextContent("2");
  });

  it("should render ticket display when click on table row", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <ModalProvider>
          <Route exact path={["/tickets", "/tickets/:id"]}>
            <Main tickets={tickets} onDeleteTicket={jest.fn()} />
          </Route>
        </ModalProvider>
      </MemoryRouter>
    );

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    fireEvent.click(rows[1]);

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

  it("should render ticket display when URL path is /tickets/:id", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <ModalProvider>
          <Route exact path={["/tickets", "/tickets/:id"]}>
            <Main tickets={tickets} onDeleteTicket={jest.fn()} />
          </Route>
        </ModalProvider>
      </MemoryRouter>
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

  it("should close ticket display when click on close button", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <ModalProvider>
          <Route exact path={["/tickets", "/tickets/:id"]}>
            <Main tickets={tickets} onDeleteTicket={jest.fn()} />
          </Route>
        </ModalProvider>
      </MemoryRouter>
    );

    const article = screen.getByRole("article", { name: "Ticket 1" });
    const closeButton = within(article).getByRole("button", { name: "close" });
    fireEvent.click(closeButton);

    expect(article).not.toBeInTheDocument();
  });

  it("should call onDelete when click on delete button", async () => {
    const mockFn = jest.fn();
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <ModalProvider>
          <Route exact path={["/tickets", "/tickets/:id"]}>
            <Main tickets={tickets} onDeleteTicket={mockFn} />
          </Route>
        </ModalProvider>
      </MemoryRouter>,
      { container: document.body.appendChild(container).firstChild }
    );

    const article = screen.getByRole("article", { name: "Ticket 1" });
    const deleteButton = within(article).getByRole("button", {
      name: "delete",
    });
    fireEvent.click(deleteButton);

    const modal = screen.getByRole("dialog", { name: "Delete ticket" });
    const confirmButton = within(modal).getByRole("button", {
      name: "Confirm",
    });
    fireEvent.click(confirmButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

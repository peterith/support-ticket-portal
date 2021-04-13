import { MemoryRouter, Route } from "react-router-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Main from "./Main";
import { AuthProvider, ModalProvider } from "../context";
import { StatusEnum, CategoryEnum, PriorityEnum, RoleEnum } from "../enums";

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
      author: "noobMaster",
      agent: "agent007",
      createdAt: "2020-01-01T00:00:00",
      updatedAt: "2020-01-02T00:00:00",
    },
  ];

  it("should render ticket table and total tickets", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <AuthProvider>
          <ModalProvider>
            <Route exact path={["/tickets", "/tickets/:id"]}>
              <Main
                tickets={tickets}
                onDeleteTicket={jest.fn()}
                onUpdateTicket={jest.fn()}
              />
            </Route>
          </ModalProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const table = screen.getByRole("table");
    const [head, body] = within(table).getAllByRole("rowgroup");
    const headers = within(head).getAllByRole("columnheader");
    const row = within(body).getByRole("row");
    const ticket = within(row).getAllByRole("cell");

    expect(headers[0]).toHaveTextContent("ID");
    expect(headers[1]).toHaveTextContent("Title");
    expect(headers[2]).toHaveTextContent("Status");
    expect(headers[3]).toHaveTextContent("Category");
    expect(headers[4]).toHaveTextContent("Priority");

    expect(ticket[0]).toHaveTextContent("1");
    expect(ticket[1]).toHaveTextContent("Ticket 1");
    expect(ticket[2]).toHaveTextContent("Open");
    expect(ticket[3]).toHaveTextContent("BUG");

    const mediumPriority = within(ticket[4]).getByRole("img", {
      name: "medium priority",
    });
    expect(ticket[4]).toContainElement(mediumPriority);

    const totalTickets = screen.getByLabelText("Total tickets:");
    expect(totalTickets).toHaveTextContent("1");
  });

  it("should render ticket display when click on table row", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <AuthProvider>
          <ModalProvider>
            <Route exact path={["/tickets", "/tickets/:id"]}>
              <Main
                tickets={tickets}
                onDeleteTicket={jest.fn()}
                onUpdateTicket={jest.fn()}
              />
            </Route>
          </ModalProvider>
        </AuthProvider>
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
    expect(authorField).toHaveTextContent("noobMaster");

    const agentField = within(article).getByLabelText("Agent");
    expect(agentField).toHaveTextContent("agent007");

    const createdField = within(article).getByLabelText("Created");
    expect(createdField).toBeInTheDocument();

    const modifiedField = within(article).getByLabelText("Modified");
    expect(modifiedField).toBeInTheDocument();
  });

  it("should render ticket display when URL path is /tickets/:id", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider>
          <ModalProvider>
            <Route exact path={["/tickets", "/tickets/:id"]}>
              <Main
                tickets={tickets}
                onDeleteTicket={jest.fn()}
                onUpdateTicket={jest.fn()}
              />
            </Route>
          </ModalProvider>
        </AuthProvider>
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
    expect(authorField).toHaveTextContent("noobMaster");

    const agentField = within(article).getByLabelText("Agent");
    expect(agentField).toHaveTextContent("agent007");

    const createdField = within(article).getByLabelText("Created");
    expect(createdField).toBeInTheDocument();

    const modifiedField = within(article).getByLabelText("Modified");
    expect(modifiedField).toBeInTheDocument();
  });

  it("should close ticket display when click on close button", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider>
          <ModalProvider>
            <Route exact path={["/tickets", "/tickets/:id"]}>
              <Main
                tickets={tickets}
                onDeleteTicket={jest.fn()}
                onUpdateTicket={jest.fn()}
              />
            </Route>
          </ModalProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const article = screen.getByRole("article", { name: "Ticket 1" });
    const closeButton = within(article).getByRole("button", { name: "close" });
    fireEvent.click(closeButton);

    expect(article).not.toBeInTheDocument();
  });

  it("should call onDeleteTicket when delete ticket", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <Route exact path={["/tickets", "/tickets/:id"]}>
              <Main
                tickets={tickets}
                onDeleteTicket={mockFn}
                onUpdateTicket={jest.fn()}
              />
            </Route>
          </ModalProvider>
        </AuthProvider>
      </MemoryRouter>,
      { container: document.body.appendChild(container).firstChild }
    );

    const article = screen.getByRole("article", { name: "Ticket 1" });
    const deleteButton = within(article).getByRole("button", {
      name: "delete",
    });
    fireEvent.click(deleteButton);

    const modal = screen.getByRole("dialog", { name: "Confirmation" });
    const confirmButton = within(modal).getByRole("button", {
      name: "Confirm",
    });
    fireEvent.click(confirmButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(tickets[0]);
  });

  it("should call onUpdateTicket when update description", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <Route exact path={["/tickets", "/tickets/:id"]}>
              <Main
                tickets={tickets}
                onDeleteTicket={jest.fn()}
                onUpdateTicket={mockFn}
              />
            </Route>
          </ModalProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const article = screen.getByRole("article", { name: "Ticket 1" });

    const descriptionButton = within(article).getByRole("button", {
      name: "Description",
    });
    fireEvent.click(descriptionButton);

    const descriptionField = within(article).getByRole("textbox", {
      name: "Description",
    });
    fireEvent.change(descriptionField, {
      target: { value: "New Description 1" },
    });
    fireEvent.blur(descriptionField);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(1, {
      title: "Ticket 1",
      description: "New Description 1",
      status: StatusEnum.OPEN,
      category: CategoryEnum.BUG,
      priority: PriorityEnum.MEDIUM,
      agent: "agent007",
    });
  });

  it("should call onUpdateTicket when update status", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <Route exact path={["/tickets", "/tickets/:id"]}>
              <Main
                tickets={tickets}
                onDeleteTicket={jest.fn()}
                onUpdateTicket={mockFn}
              />
            </Route>
          </ModalProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const article = screen.getByRole("article", { name: "Ticket 1" });

    const statusButton = within(article).getByRole("button", {
      name: "Status",
    });
    fireEvent.click(statusButton);

    const statuses = within(article).getByRole("listbox", { name: "Status" });
    const resolvedStatus = within(statuses).getByText("Resolved");
    fireEvent.click(resolvedStatus);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(1, {
      title: "Ticket 1",
      description: "Description 1",
      status: StatusEnum.RESOLVED,
      category: CategoryEnum.BUG,
      priority: PriorityEnum.MEDIUM,
      agent: "agent007",
    });
  });

  it("should call onUpdateTicket when update category", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <Route exact path={["/tickets", "/tickets/:id"]}>
              <Main
                tickets={tickets}
                onDeleteTicket={jest.fn()}
                onUpdateTicket={mockFn}
              />
            </Route>
          </ModalProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const article = screen.getByRole("article", { name: "Ticket 1" });

    const categoryButton = within(article).getByRole("button", {
      name: "Category",
    });
    fireEvent.click(categoryButton);

    const categories = within(article).getByRole("listbox", {
      name: "Category",
    });
    const technicalIssueCategory = within(categories).getByText(
      "Technical Issue"
    );
    fireEvent.click(technicalIssueCategory);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(1, {
      title: "Ticket 1",
      description: "Description 1",
      status: StatusEnum.OPEN,
      category: CategoryEnum.TECHNICAL_ISSUE,
      priority: PriorityEnum.MEDIUM,
      agent: "agent007",
    });
  });

  it("should call onUpdateTicket when update priority", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <Route exact path={["/tickets", "/tickets/:id"]}>
              <Main
                tickets={tickets}
                onDeleteTicket={jest.fn()}
                onUpdateTicket={mockFn}
              />
            </Route>
          </ModalProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const article = screen.getByRole("article", { name: "Ticket 1" });

    const priorityButton = within(article).getByRole("button", {
      name: "Priority",
    });
    fireEvent.click(priorityButton);

    const priorities = within(article).getByRole("listbox", {
      name: "Priority",
    });
    const highPriority = within(priorities).getByText("High");
    fireEvent.click(highPriority);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(1, {
      title: "Ticket 1",
      description: "Description 1",
      status: StatusEnum.OPEN,
      category: CategoryEnum.BUG,
      priority: PriorityEnum.HIGH,
      agent: "agent007",
    });
  });
});

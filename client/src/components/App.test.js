import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import App from "./App";
import { ModalProvider } from "../context/ModalContext";
import { StatusEnum, CategoryEnum, PriorityEnum } from "../enums";

describe("App", () => {
  const server = setupServer(
    rest.get(`${process.env.REACT_APP_SERVER_URL}/tickets`, (req, res, ctx) => {
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

      return res(ctx.json(tickets));
    }),
    rest.post(
      `${process.env.REACT_APP_SERVER_URL}/tickets`,
      (req, res, ctx) => {
        const { title, description, category, author } = req.body;

        return res(
          ctx.json({
            id: 3,
            title,
            description,
            status: StatusEnum.OPEN,
            category,
            priority: PriorityEnum.MEDIUM,
            author,
            createdAt: "2020-01-05T00:00:00",
            updatedAt: "2020-01-05T00:00:00",
          })
        );
      }
    ),
    rest.delete(
      `${process.env.REACT_APP_SERVER_URL}/tickets/1`,
      (req, res, ctx) => {
        return res(ctx.status(200));
      }
    ),
    rest.put(
      `${process.env.REACT_APP_SERVER_URL}/tickets/1`,
      (req, res, ctx) => {
        return res(
          ctx.json({
            id: 1,
            createdAt: "2020-01-05T00:00:00",
            updatedAt: "2020-01-05T00:00:00",
            ...req.body,
          })
        );
      }
    )
  );

  const appRoot = document.createElement("div");
  appRoot.id = "app-root";
  const modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  const container = document.createElement("div");
  container.append(appRoot, modalRoot);

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it("should display header and ticket table", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </MemoryRouter>
    );

    const createButton = screen.getByRole("button", { name: "Create" });
    expect(createButton).toBeInTheDocument();

    const table = screen.getByRole("table");
    const [head, body] = within(table).getAllByRole("rowgroup");
    const headers = within(head).getAllByRole("columnheader");

    const rows = await waitFor(() => {
      return within(body).getAllByRole("row");
    });
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

  it("should display network error when server is down", async () => {
    server.use(
      rest.get(
        `${process.env.REACT_APP_SERVER_URL}/tickets`,
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );

    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </MemoryRouter>
    );

    const errorMessage = await waitFor(() => {
      return screen.getByRole("alert");
    });
    expect(errorMessage).toHaveTextContent(
      "Network error, please try again later :("
    );
  });

  it("should create ticket", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </MemoryRouter>,
      { container: document.body.appendChild(container).firstChild }
    );

    const header = screen.getByRole("banner");
    const createButton = within(header).getByRole("button", { name: "Create" });
    fireEvent.click(createButton);

    const createTicketForm = screen.getByRole("dialog", {
      name: "Create ticket",
    });

    const titleField = within(createTicketForm).getByLabelText("Title");
    fireEvent.change(titleField, { target: { value: "Ticket 3" } });

    const descriptionField = within(createTicketForm).getByLabelText(
      "Description"
    );
    fireEvent.change(descriptionField, { target: { value: "Description 3" } });

    const categoryField = within(createTicketForm).getByLabelText("Category");
    fireEvent.change(categoryField, {
      target: { value: CategoryEnum.TECHNICAL_ISSUE },
    });

    const authorField = within(createTicketForm).getByLabelText("Author");
    fireEvent.change(authorField, { target: { value: "John Doe" } });

    const submitButton = within(createTicketForm).getByRole("button", {
      name: "Create",
    });
    fireEvent.click(submitButton);

    const table = screen.getByRole("table");
    const [head, body] = within(table).getAllByRole("rowgroup");
    const headers = within(head).getAllByRole("columnheader");

    const rows = await waitFor(() => {
      const r = within(body).getAllByRole("row");
      expect(r).toHaveLength(3);
      return r;
    });

    const ticket1 = within(rows[0]).getAllByRole("cell");
    const ticket2 = within(rows[1]).getAllByRole("cell");
    const ticket3 = within(rows[2]).getAllByRole("cell");

    expect(headers[0]).toHaveTextContent("ID");
    expect(headers[1]).toHaveTextContent("Title");
    expect(headers[2]).toHaveTextContent("Status");
    expect(headers[3]).toHaveTextContent("Category");
    expect(headers[4]).toHaveTextContent("Priority");

    expect(ticket1[0]).toHaveTextContent("1");
    expect(ticket1[1]).toHaveTextContent("Ticket 1");
    expect(ticket1[2]).toHaveTextContent("Open");
    expect(ticket1[3]).toHaveTextContent("BUG");

    const mediumPriority1 = within(ticket1[4]).getByRole("img", {
      name: "medium priority",
    });
    expect(ticket1[4]).toContainElement(mediumPriority1);

    expect(ticket2[0]).toHaveTextContent("2");
    expect(ticket2[1]).toHaveTextContent("Ticket 2");
    expect(ticket2[2]).toHaveTextContent("In Progress");
    expect(ticket2[3]).toHaveTextContent("FEATURE REQUEST");

    const highPriority = within(ticket2[4]).getByRole("img", {
      name: "high priority",
    });
    expect(ticket2[4]).toContainElement(highPriority);

    expect(ticket3[0]).toHaveTextContent("3");
    expect(ticket3[1]).toHaveTextContent("Ticket 3");
    expect(ticket3[2]).toHaveTextContent("Open");
    expect(ticket3[3]).toHaveTextContent("TECHNICAL ISSUE");

    const mediumPriority2 = within(ticket3[4]).getByRole("img", {
      name: "medium priority",
    });
    expect(ticket3[4]).toContainElement(mediumPriority2);

    const totalTickets = screen.getByLabelText("Total tickets:");
    expect(totalTickets).toHaveTextContent("3");
  });

  it("should delete ticket", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </MemoryRouter>,
      { container: document.body.appendChild(container).firstChild }
    );

    const article = await waitFor(() =>
      screen.getByRole("article", { name: "Ticket 1" })
    );
    const deleteButton = within(article).getByRole("button", {
      name: "delete",
    });
    fireEvent.click(deleteButton);

    const modal = screen.getByRole("dialog", { name: "Delete ticket" });
    const confirmButton = within(modal).getByRole("button", {
      name: "Confirm",
    });
    fireEvent.click(confirmButton);

    const table = screen.getByRole("table");
    const [head, body] = within(table).getAllByRole("rowgroup");
    const headers = within(head).getAllByRole("columnheader");

    const row = await waitFor(() => within(body).getByRole("row"));
    const ticket = within(row).getAllByRole("cell");

    expect(headers[0]).toHaveTextContent("ID");
    expect(headers[1]).toHaveTextContent("Title");
    expect(headers[2]).toHaveTextContent("Status");
    expect(headers[3]).toHaveTextContent("Category");
    expect(headers[4]).toHaveTextContent("Priority");

    expect(ticket[0]).toHaveTextContent("2");
    expect(ticket[1]).toHaveTextContent("Ticket 2");
    expect(ticket[2]).toHaveTextContent("In Progress");
    expect(ticket[3]).toHaveTextContent("FEATURE REQUEST");

    const highPriority = within(ticket[4]).getByRole("img", {
      name: "high priority",
    });
    expect(ticket[4]).toContainElement(highPriority);

    const totalTickets = screen.getByLabelText("Total tickets:");
    expect(totalTickets).toHaveTextContent("1");
  });

  it("should update ticket description", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </MemoryRouter>
    );

    const article = await waitFor(() =>
      screen.getByRole("article", { name: "Ticket 1" })
    );

    const descriptionButton = within(article).getByRole("button", {
      name: "Description",
    });
    fireEvent.click(descriptionButton);

    const descriptionField1 = within(article).getByRole("textbox", {
      name: "Description",
    });
    fireEvent.change(descriptionField1, {
      target: { value: "New Description 1" },
    });
    fireEvent.blur(descriptionField1);

    const descriptionField2 = within(article).getByLabelText("Description");
    await waitFor(() => {
      expect(descriptionField2).toHaveTextContent("New Description 1");
    });

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

  it("should update ticket status", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </MemoryRouter>
    );

    const article = await waitFor(() =>
      screen.getByRole("article", { name: "Ticket 1" })
    );

    const statusButton = within(article).getByRole("button", {
      name: "Status",
    });
    fireEvent.click(statusButton);

    const statuses = within(article).getByRole("listbox", { name: "Status" });
    const resolvedStatus = within(statuses).getByText("Resolved");
    fireEvent.click(resolvedStatus);

    const heading = within(article).getByRole("heading", { name: "Ticket 1" });
    expect(heading).toBeInTheDocument();

    const descriptionField = within(article).getByLabelText("Description");
    expect(descriptionField).toHaveTextContent("Description 1");

    const idField = within(article).getByLabelText("ID");
    expect(idField).toHaveTextContent("1");

    const statusField = within(article).getByLabelText("Status");
    await waitFor(() => {
      expect(statusField).toHaveTextContent("Resolved");
    });

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
    await waitFor(() => {
      expect(ticket1[2]).toHaveTextContent("Resolved");
    });
    expect(ticket1[3]).toHaveTextContent("BUG");

    const mediumPriority1 = within(ticket1[4]).getByRole("img", {
      name: "medium priority",
    });
    expect(ticket1[4]).toContainElement(mediumPriority1);

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

  it("should update ticket category", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </MemoryRouter>
    );

    const article = await waitFor(() =>
      screen.getByRole("article", { name: "Ticket 1" })
    );

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

    const heading = within(article).getByRole("heading", { name: "Ticket 1" });
    expect(heading).toBeInTheDocument();

    const descriptionField = within(article).getByLabelText("Description");
    expect(descriptionField).toHaveTextContent("Description 1");

    const idField = within(article).getByLabelText("ID");
    expect(idField).toHaveTextContent("1");

    const statusField = within(article).getByLabelText("Status");
    expect(statusField).toHaveTextContent("Open");

    const categoryField = within(article).getByLabelText("Category");
    await waitFor(() => {
      expect(categoryField).toHaveTextContent("TECHNICAL ISSUE");
    });

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
    await waitFor(() => {
      expect(ticket1[3]).toHaveTextContent("TECHNICAL ISSUE");
    });

    const mediumPriority1 = within(ticket1[4]).getByRole("img", {
      name: "medium priority",
    });
    expect(ticket1[4]).toContainElement(mediumPriority1);

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

  it("should update ticket priority", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </MemoryRouter>
    );

    const article = await waitFor(() =>
      screen.getByRole("article", { name: "Ticket 1" })
    );

    const priorityButton = within(article).getByRole("button", {
      name: "Priority",
    });
    fireEvent.click(priorityButton);

    const priorities = within(article).getByRole("listbox", {
      name: "Priority",
    });
    const lowPriority1 = within(priorities).getByText("Low");
    fireEvent.click(lowPriority1);

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
    const lowPriority2 = await waitFor(() =>
      within(article).getByRole("img", { name: "low priority" })
    );
    expect(priorityField).toContainElement(lowPriority2);

    const authorField = within(article).getByLabelText("Author");
    expect(authorField).toHaveTextContent("John Doe");

    const agentField = within(article).getByLabelText("Agent");
    expect(agentField).toHaveTextContent("Joe Bloggs");

    const createdField = within(article).getByLabelText("Created");
    expect(createdField).toBeInTheDocument();

    const modifiedField = within(article).getByLabelText("Modified");
    expect(modifiedField).toBeInTheDocument();

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

    const lowPriority3 = await waitFor(() =>
      within(ticket1[4]).getByRole("img", { name: "low priority" })
    );
    expect(ticket1[4]).toContainElement(lowPriority3);

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
});

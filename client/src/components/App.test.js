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

  it("should display network error if server is down", async () => {
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

  it("should create ticket when click on create button and submit form", async () => {
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

  it("should delete ticket when click on delete button", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </MemoryRouter>,
      { container: document.body.appendChild(container).firstChild }
    );

    const article = await waitFor(() => {
      return screen.getByRole("article", { name: "Ticket 1" });
    });
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

    const row = await waitFor(() => {
      return within(body).getByRole("row");
    });
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
});

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
import { AuthProvider, ModalProvider } from "../context";
import { StatusEnum, CategoryEnum, PriorityEnum, RoleEnum } from "../enums";

describe("App", () => {
  const server = setupServer(
    rest.post(
      `${process.env.REACT_APP_SERVER_URL}/authenticate`,
      (req, res, ctx) =>
        res(
          ctx.json({
            token:
              "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJub29iTWFzdGVyIiwiZXhwIjoxNjE4OTM0MDA3LCJpYXQiOjE2MTgzMjkyMDcsInJvbGUiOiJDTElFTlQifQ.Fig_kgVVuV0AgvW8fVgzy3BG-gZYMUqxu1fuv5ehpE8XLVXPAWGQ8QJFJp-Ee4_49UUrAx7tXkmhBDJn3mVhDA",
          })
        )
    ),
    rest.get(`${process.env.REACT_APP_SERVER_URL}/tickets`, (req, res, ctx) => {
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

      return res(ctx.json(tickets));
    }),
    rest.post(`${process.env.REACT_APP_SERVER_URL}/tickets`, (req, res, ctx) =>
      res(
        ctx.json({
          id: 3,
          status: StatusEnum.OPEN,
          priority: PriorityEnum.MEDIUM,
          author: "noobMaster",
          createdAt: "2020-01-05T00:00:00",
          updatedAt: "2020-01-05T00:00:00",
          ...req.body,
        })
      )
    ),
    rest.delete(
      `${process.env.REACT_APP_SERVER_URL}/tickets/1`,
      (req, res, ctx) => res(ctx.status(200))
    ),
    rest.put(`${process.env.REACT_APP_SERVER_URL}/tickets/1`, (req, res, ctx) =>
      res(
        ctx.json({
          id: 1,
          author: "noobMaster",
          createdAt: "2020-01-05T00:00:00",
          updatedAt: "2020-01-05T00:00:00",
          ...req.body,
        })
      )
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

  it("should render app", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <AuthProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
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
    const ticket = within(rows[0]).getAllByRole("cell");

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

  it("should sign in", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <AuthProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
      </MemoryRouter>,
      { container: document.body.appendChild(container).firstChild }
    );

    const header = screen.getByRole("banner");

    const signInButton = within(header).getByRole("button", {
      name: "Sign In",
    });
    fireEvent.click(signInButton);

    const signInForm = screen.getByRole("dialog", { name: "Sign In" });

    const usernameField = within(signInForm).getByLabelText("Username");
    fireEvent.change(usernameField, { target: { value: "noobMaster" } });

    const passwordField = within(signInForm).getByLabelText("Password");
    fireEvent.change(passwordField, { target: { value: "password" } });

    const submitButton = within(signInForm).getByRole("button", {
      name: "Sign In",
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const signOutButton = within(header).getByRole("button", {
        name: "Sign Out",
      });
      expect(signOutButton).toBeInTheDocument();
    });
  });

  it("should sign out", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
      </MemoryRouter>,
      { container: document.body.appendChild(container).firstChild }
    );

    const header = screen.getByRole("banner");

    const signOutButton = within(header).getByRole("button", {
      name: "Sign Out",
    });
    fireEvent.click(signOutButton);

    const modal = screen.getByRole("dialog", { name: "Confirmation" });
    const confirmButton = within(modal).getByRole("button", {
      name: "Confirm",
    });
    fireEvent.click(confirmButton);

    const signInButton = within(header).getByRole("button", {
      name: "Sign In",
    });
    expect(signInButton).toBeInTheDocument();
  });

  it("should render alert when get network error", async () => {
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
        <AuthProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
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
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
      </MemoryRouter>,
      { container: document.body.appendChild(container).firstChild }
    );

    const header = screen.getByRole("banner");
    const createButton = within(header).getByRole("button", { name: "Create" });
    fireEvent.click(createButton);

    const createTicketForm = screen.getByRole("dialog", {
      name: "Create Ticket",
    });

    const titleField = within(createTicketForm).getByLabelText("Title");
    fireEvent.change(titleField, { target: { value: "Ticket 2" } });

    const descriptionField = within(createTicketForm).getByLabelText(
      "Description"
    );
    fireEvent.change(descriptionField, { target: { value: "Description 2" } });

    const categoryField = within(createTicketForm).getByLabelText("Category");
    fireEvent.change(categoryField, {
      target: { value: CategoryEnum.FEATURE_REQUEST },
    });

    const submitButton = within(createTicketForm).getByRole("button", {
      name: "Create",
    });
    fireEvent.click(submitButton);

    const table = screen.getByRole("table");
    const [head, body] = within(table).getAllByRole("rowgroup");
    const headers = within(head).getAllByRole("columnheader");

    const rows = await waitFor(() => {
      const r = within(body).getAllByRole("row");
      expect(r).toHaveLength(2);
      return r;
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

    const mediumPriority1 = within(ticket1[4]).getByRole("img", {
      name: "medium priority",
    });
    expect(ticket1[4]).toContainElement(mediumPriority1);

    expect(ticket2[0]).toHaveTextContent("3");
    expect(ticket2[1]).toHaveTextContent("Ticket 2");
    expect(ticket2[2]).toHaveTextContent("Open");
    expect(ticket2[3]).toHaveTextContent("FEATURE REQUEST");

    const mediumPriority2 = within(ticket2[4]).getByRole("img", {
      name: "medium priority",
    });
    expect(ticket2[4]).toContainElement(mediumPriority2);

    const totalTickets = screen.getByLabelText("Total tickets:");
    expect(totalTickets).toHaveTextContent("2");
  });

  it("should delete ticket", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
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

    const modal = screen.getByRole("dialog", { name: "Confirmation" });
    const confirmButton = within(modal).getByRole("button", {
      name: "Confirm",
    });
    fireEvent.click(confirmButton);

    const table = screen.getByRole("table");
    const [, body] = within(table).getAllByRole("rowgroup");

    await waitFor(() => {
      const rows = within(body).queryAllByRole("row");
      expect(rows).toHaveLength(0);
    });

    const totalTickets = screen.getByLabelText("Total tickets:");
    expect(totalTickets).toHaveTextContent("0");
  });

  it("should update ticket description", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
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
  });

  it("should update ticket status", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
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
    const inProgressStatus = within(statuses).getByText("In Progress");
    fireEvent.click(inProgressStatus);

    const statusField = within(article).getByLabelText("Status");
    await waitFor(() => {
      expect(statusField).toHaveTextContent("In Progress");
    });

    const table = screen.getByRole("table");
    const [, body] = within(table).getAllByRole("rowgroup");
    const rows = within(body).getAllByRole("row");
    const ticket = within(rows[0]).getAllByRole("cell");
    await waitFor(() => {
      expect(ticket[2]).toHaveTextContent("In Progress");
    });
  });

  it("should update ticket category", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
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

    const categoryField = within(article).getByLabelText("Category");
    await waitFor(() => {
      expect(categoryField).toHaveTextContent("TECHNICAL ISSUE");
    });

    const table = screen.getByRole("table");
    const [, body] = within(table).getAllByRole("rowgroup");
    const rows = within(body).getAllByRole("row");
    const ticket = within(rows[0]).getAllByRole("cell");
    await waitFor(() => {
      expect(ticket[3]).toHaveTextContent("TECHNICAL ISSUE");
    });
  });

  it("should update ticket priority", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <AuthProvider initialUser={initialUser}>
          <ModalProvider>
            <App />
          </ModalProvider>
        </AuthProvider>
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

    const priorityField = within(article).getByLabelText("Priority");
    await waitFor(() => {
      const lowPriority2 = within(article).getByRole("img", {
        name: "low priority",
      });
      expect(priorityField).toContainElement(lowPriority2);
    });

    const table = screen.getByRole("table");
    const [, body] = within(table).getAllByRole("rowgroup");
    const rows = within(body).getAllByRole("row");
    const ticket = within(rows[0]).getAllByRole("cell");
    await waitFor(() => {
      const lowPriority2 = within(ticket[4]).getByRole("img", {
        name: "low priority",
      });
      expect(ticket[4]).toContainElement(lowPriority2);
    });
  });
});

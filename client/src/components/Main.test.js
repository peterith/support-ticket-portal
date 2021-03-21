import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route } from "react-router-dom";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import Main from "./Main";
import { StatusEnum, CategoryEnum, PriorityEnum } from "../enums";

describe("Main", () => {
  const server = setupServer(
    rest.get(`${process.env.REACT_APP_SERVER_URL}/tickets`, (req, res, ctx) => {
      return res(
        ctx.json([
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
        ])
      );
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it("should display ticket table and total tickets", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <Main />
      </MemoryRouter>
    );
    const table = await waitFor(() => {
      const table = screen.getByRole("table");
      expect(screen.getAllByRole("row")).toHaveLength(3);
      return table;
    });
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
    expect(ticket1[4]).toContainElement(
      within(ticket1[4]).getByRole("img", { name: "medium priority" })
    );

    expect(ticket2[0]).toHaveTextContent("2");
    expect(ticket2[1]).toHaveTextContent("Ticket 2");
    expect(ticket2[2]).toHaveTextContent("In Progress");
    expect(ticket2[3]).toHaveTextContent("FEATURE REQUEST");
    expect(ticket2[4]).toContainElement(
      within(ticket2[4]).getByRole("img", { name: "high priority" })
    );

    expect(screen.getByLabelText("Total tickets:")).toHaveTextContent("2");
  });

  it("should display network error when fetch fails", async () => {
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
        <Route exact path={["/", "/tickets", "/tickets/:id"]}>
          <Main />
        </Route>
      </MemoryRouter>
    );
    const alert = await waitFor(() => {
      return screen.getByRole("alert");
    });

    expect(alert).toHaveTextContent("Network error, please try again later :(");
  });

  it("should render ticket display when click on table row", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets"]}>
        <Route exact path={["/", "/tickets", "/tickets/:id"]}>
          <Main />
        </Route>
      </MemoryRouter>
    );
    const row = await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(3);
      return rows[1];
    });
    fireEvent.click(row);
    const article = await waitFor(() => {
      return screen.getByRole("article", { name: "Ticket 1" });
    });

    expect(
      within(article).getByRole("heading", { name: "Ticket 1" })
    ).toBeInTheDocument();
    expect(within(article).getByLabelText("Description")).toHaveTextContent(
      "Description 1"
    );
    expect(within(article).getByLabelText("ID")).toHaveTextContent("1");
    expect(within(article).getByLabelText("Status")).toHaveTextContent("Open");
    expect(within(article).getByLabelText("Category")).toHaveTextContent("BUG");
    expect(within(article).getByLabelText("Priority")).toContainElement(
      within(article).getByRole("img", { name: "medium priority" })
    );
    expect(within(article).getByLabelText("Author")).toHaveTextContent(
      "John Doe"
    );
    expect(within(article).getByLabelText("Agent")).toHaveTextContent(
      "Joe Bloggs"
    );
    expect(within(article).getByLabelText("Created")).toHaveTextContent(
      "1/1/2020, 12:00:00 AM"
    );
    expect(within(article).getByLabelText("Modified")).toHaveTextContent(
      "1/2/2020, 12:00:00 AM"
    );
  });

  it("should render ticket display when URL path is /tickets/:id", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <Route exact path={["/", "/tickets", "/tickets/:id"]}>
          <Main />
        </Route>
      </MemoryRouter>
    );
    const article = await waitFor(() => {
      return screen.getByRole("article", { name: "Ticket 1" });
    });

    expect(
      within(article).getByRole("heading", { name: "Ticket 1" })
    ).toBeInTheDocument();
    expect(within(article).getByLabelText("Description")).toHaveTextContent(
      "Description 1"
    );
    expect(within(article).getByLabelText("ID")).toHaveTextContent("1");
    expect(within(article).getByLabelText("Status")).toHaveTextContent("Open");
    expect(within(article).getByLabelText("Category")).toHaveTextContent("BUG");
    expect(within(article).getByLabelText("Priority")).toContainElement(
      within(article).getByRole("img", { name: "medium priority" })
    );
    expect(within(article).getByLabelText("Author")).toHaveTextContent(
      "John Doe"
    );
    expect(within(article).getByLabelText("Agent")).toHaveTextContent(
      "Joe Bloggs"
    );
    expect(within(article).getByLabelText("Created")).toHaveTextContent(
      "1/1/2020, 12:00:00 AM"
    );
    expect(within(article).getByLabelText("Modified")).toHaveTextContent(
      "1/2/2020, 12:00:00 AM"
    );
  });

  it("should close ticket display when click on close button", async () => {
    render(
      <MemoryRouter initialEntries={["/tickets/1"]}>
        <Route exact path={["/", "/tickets", "/tickets/:id"]}>
          <Main />
        </Route>
      </MemoryRouter>
    );
    const article = await waitFor(() => {
      return screen.getByRole("article", { name: "Ticket 1" });
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Close ticket display" })
    );
    await waitFor(() => {
      expect(article).not.toBeInTheDocument();
    });
  });
});

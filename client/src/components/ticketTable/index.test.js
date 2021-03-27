import { render, fireEvent, screen, within } from "@testing-library/react";
import TicketTable from ".";
import { CategoryEnum, PriorityEnum, StatusEnum } from "../../enums";

describe("Ticket Table", () => {
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

  it("should display tickets", () => {
    render(
      <TicketTable tickets={tickets} selectedRow={0} onClickRow={jest.fn()} />
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
  });

  it("should call onClick callback when click row", () => {
    const mockFn = jest.fn();
    render(
      <TicketTable tickets={tickets} selectedRow={0} onClickRow={mockFn} />
    );

    fireEvent.click(screen.getByText("Ticket 1"));

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(tickets[0]);
  });
});

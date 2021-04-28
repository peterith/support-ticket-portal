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
      author: "noobMaster",
      agent: "agent007",
      createdAt: "2020-01-01T00:00:00",
      updatedAt: "2020-01-02T00:00:00",
    },
  ];

  it("should render ticket table", () => {
    render(
      <TicketTable tickets={tickets} selectedRow={0} onClickRow={jest.fn()} />
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

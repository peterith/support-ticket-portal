import { render, screen, fireEvent } from "@testing-library/react";
import TicketDisplay from "./TicketDisplay";
import { StatusEnum, CategoryEnum, PriorityEnum } from "../enums";

describe("Ticket Display", () => {
  it("should render ticket display", () => {
    render(
      <TicketDisplay
        ticket={{
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
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Ticket 1" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toHaveTextContent(
      "Description 1"
    );
    expect(screen.getByLabelText("ID")).toHaveTextContent("1");
    expect(screen.getByLabelText("Status")).toHaveTextContent("Open");
    expect(screen.getByLabelText("Category")).toHaveTextContent("BUG");
    expect(screen.getByLabelText("Priority")).toContainElement(
      screen.getByRole("img", { name: "medium priority" })
    );
    expect(screen.getByLabelText("Author")).toHaveTextContent("John Doe");
    expect(screen.getByLabelText("Agent")).toHaveTextContent("Joe Bloggs");
    expect(screen.getByLabelText("Created")).toHaveTextContent(
      "1/1/2020, 12:00:00 AM"
    );
    expect(screen.getByLabelText("Modified")).toHaveTextContent(
      "1/2/2020, 12:00:00 AM"
    );
  });

  it("should close the ticket display", () => {
    const mockFn = jest.fn();
    render(
      <TicketDisplay
        ticket={{
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
        }}
        onClose={mockFn}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Close ticket display" })
    );
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

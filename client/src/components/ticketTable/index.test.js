import { render, fireEvent, screen } from "@testing-library/react";
import TicketTable from ".";
import { CategoryEnum, PriorityEnum, StatusEnum } from "../../enums";

describe("Ticket Table", () => {
  it("should display tickets", () => {
    render(
      <TicketTable
        tickets={[
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
        ]}
        selectedRow={0}
        onClickRow={jest.fn()}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Ticket 1")).toBeInTheDocument();
    expect(screen.getByText(/open/i)).toBeInTheDocument();
    expect(screen.getByText(/bug/i)).toBeInTheDocument();
    expect(screen.getByLabelText("medium priority")).toBeInTheDocument();

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Ticket 2")).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/feature request/i)).toBeInTheDocument();
    expect(screen.getByLabelText("high priority")).toBeInTheDocument();
  });

  it("should call onClick callback when click row", () => {
    const mockFn = jest.fn();
    const ticket1 = {
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
    const ticket2 = {
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
    };

    render(
      <TicketTable
        tickets={[ticket1, ticket2]}
        selectedRow={0}
        onClickRow={mockFn}
      />
    );
    fireEvent.click(screen.getByText("Ticket 1"));

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(ticket1);
  });
});

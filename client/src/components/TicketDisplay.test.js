import { render, screen, fireEvent } from "@testing-library/react";
import TicketDisplay from "./TicketDisplay";
import { StatusEnum, CategoryEnum, PriorityEnum } from "../enums";

describe("Ticket Display", () => {
  const ticket = {
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

  it("should render ticket display", () => {
    render(<TicketDisplay ticket={ticket} onClose={jest.fn()} />);

    const heading = screen.getByRole("heading", { name: "Ticket 1" });
    expect(heading).toBeInTheDocument();

    const descriptionField = screen.getByLabelText("Description");
    expect(descriptionField).toHaveTextContent("Description 1");

    const idField = screen.getByLabelText("ID");
    expect(idField).toHaveTextContent("1");

    const statusField = screen.getByLabelText("Status");
    expect(statusField).toHaveTextContent("Open");

    const categoryField = screen.getByLabelText("Category");
    expect(categoryField).toHaveTextContent("BUG");

    const priorityField = screen.getByLabelText("Priority");
    const mediumPriority = screen.getByRole("img", {
      name: "medium priority",
    });
    expect(priorityField).toContainElement(mediumPriority);

    const authorField = screen.getByLabelText("Author");
    expect(authorField).toHaveTextContent("John Doe");

    const agentField = screen.getByLabelText("Agent");
    expect(agentField).toHaveTextContent("Joe Bloggs");

    const createdField = screen.getByLabelText("Created");
    expect(createdField).toHaveTextContent("1/1/2020, 12:00:00 AM");

    const modifiedField = screen.getByLabelText("Modified");
    expect(modifiedField).toHaveTextContent("1/2/2020, 12:00:00 AM");
  });

  it("should call onClose when click on close button", () => {
    const mockFn = jest.fn();
    render(<TicketDisplay ticket={ticket} onClose={mockFn} />);

    const closeButton = screen.getByRole("button", { name: "close" });
    fireEvent.click(closeButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

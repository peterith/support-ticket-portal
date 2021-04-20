import { render, screen, fireEvent } from "@testing-library/react";
import CreateTicketForm from "./CreateTicketForm";
import { CategoryEnum } from "../../enums";

describe("Create Ticket Form", () => {
  it("should call onSubmit when submit form", () => {
    const mockFn = jest.fn();
    render(<CreateTicketForm onSubmit={mockFn} />);

    const titleField = screen.getByLabelText("Title");
    fireEvent.change(titleField, { target: { value: "Title 1" } });

    const descriptionField = screen.getByLabelText("Description");
    fireEvent.change(descriptionField, { target: { value: "Description 1" } });

    const submitButton = screen.getByRole("button", { name: "Create" });
    fireEvent.click(submitButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({
      title: "Title 1",
      description: "Description 1",
      category: CategoryEnum.BUG,
    });
  });

  it("should render alert when submit form and get error", () => {
    const mockFn = jest.fn(() => {
      throw new Error("Network error");
    });
    render(<CreateTicketForm onSubmit={mockFn} />);

    const titleField = screen.getByLabelText("Title");
    fireEvent.change(titleField, { target: { value: "Title 1" } });

    const descriptionField = screen.getByLabelText("Description");
    fireEvent.change(descriptionField, { target: { value: "Description 1" } });

    const submitButton = screen.getByRole("button", { name: "Create" });
    fireEvent.click(submitButton);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Network error");
  });

  it("should alert when title is invalid", () => {
    const mockFn = jest.fn();
    render(<CreateTicketForm onSubmit={mockFn} />);

    const descriptionField = screen.getByLabelText("Description");
    fireEvent.change(descriptionField, { target: { value: "Description 1" } });

    const submitButton = screen.getByRole("button", { name: "Create" });
    fireEvent.click(submitButton);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(
      "Title should be between 5 to 100 characters."
    );
  });

  it("should alert when description is invalid", () => {
    const mockFn = jest.fn();
    render(<CreateTicketForm onSubmit={mockFn} />);

    const titleField = screen.getByLabelText("Title");
    fireEvent.change(titleField, { target: { value: "Title 1" } });

    const descriptionField = screen.getByLabelText("Description");
    fireEvent.change(descriptionField, { target: { value: "x".repeat(1001) } });

    const submitButton = screen.getByRole("button", { name: "Create" });
    fireEvent.click(submitButton);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(
      "Description should be less than 1000 characters."
    );
  });
});

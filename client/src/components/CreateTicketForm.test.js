import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTicketForm from "./CreateTicketForm";
import { StatusEnum, PriorityEnum } from "../enums";

describe("Create Ticket Form", () => {
  const server = setupServer(
    rest.post(
      `${process.env.REACT_APP_SERVER_URL}/tickets`,
      (req, res, ctx) => {
        const { title, description, category, author } = req.body;
        const ticket = {
          id: 1,
          title,
          description,
          status: StatusEnum.OPEN,
          category,
          priority: PriorityEnum.MEDIUM,
          author,
          createdAt: "2020-01-01T00:00:00",
          updatedAt: "2020-01-02T00:00:00",
        };

        return res(ctx.json(ticket));
      }
    )
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

  it("should call onSubmit when submit form", async () => {
    const mockFn = jest.fn();
    render(<CreateTicketForm onSubmit={mockFn} />);

    const titleField = screen.getByLabelText("Title");
    fireEvent.change(titleField, { target: { value: "Title 1" } });

    const descriptionField = screen.getByLabelText("Description");
    fireEvent.change(descriptionField, { target: { value: "Description 1" } });

    const authorField = screen.getByLabelText("Author");
    fireEvent.change(authorField, { target: { value: "John Doe" } });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  it("should alert when title is invalid", () => {
    const mockFn = jest.fn();
    render(<CreateTicketForm onSubmit={mockFn} />);

    const descriptionField = screen.getByLabelText("Description");
    fireEvent.change(descriptionField, { target: { value: "Description 1" } });

    const authorField = screen.getByLabelText("Author");
    fireEvent.change(authorField, { target: { value: "John Doe" } });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

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

    const authorField = screen.getByLabelText("Author");
    fireEvent.change(authorField, { target: { value: "John Doe" } });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(
      "Description should be less than 1000 characters."
    );
  });

  it("should alert when author is invalid", () => {
    const mockFn = jest.fn();
    render(<CreateTicketForm onSubmit={mockFn} />);

    const titleField = screen.getByLabelText("Title");
    fireEvent.change(titleField, { target: { value: "Title 1" } });

    const descriptionField = screen.getByLabelText("Description");
    fireEvent.change(descriptionField, { target: { value: "Description 1" } });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Author is mandatory.");
  });
});

import { fireEvent, render, screen, within } from "@testing-library/react";
import { CategoryEnum, StatusEnum } from "../enums";
import SearchFilter from "./SearchFilter";

describe("Search Filter", () => {
  it("should render search filter", () => {
    render(<SearchFilter onFilter={jest.fn()} />);

    const search = screen.getByRole("search");
    const statusField = within(search).getByLabelText("Status");
    expect(statusField).toHaveDisplayValue("All");
  });

  it("should call onFilter when filter by status", () => {
    const mockFn = jest.fn();
    render(<SearchFilter onFilter={mockFn} />);

    const search = screen.getByRole("search");
    const statusField = within(search).getByLabelText("Status");
    fireEvent.change(statusField, { target: { value: StatusEnum.OPEN } });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({
      status: StatusEnum.OPEN,
      category: null,
    });
  });

  it("should call onFilter with null when filter by status and select All", () => {
    const mockFn = jest.fn();
    render(<SearchFilter onFilter={mockFn} />);

    const search = screen.getByRole("search");
    const statusField = within(search).getByLabelText("Status");
    fireEvent.change(statusField, { target: { value: "All" } });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ status: null, category: null });
  });

  it("should call onFilter when filter by category", () => {
    const mockFn = jest.fn();
    render(<SearchFilter onFilter={mockFn} />);

    const search = screen.getByRole("search");
    const categoryField = within(search).getByLabelText("Category");
    fireEvent.change(categoryField, { target: { value: CategoryEnum.BUG } });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({
      status: null,
      category: CategoryEnum.BUG,
    });
  });

  it("should call onFilter with null when filter by category and select All", () => {
    const mockFn = jest.fn();
    render(<SearchFilter onFilter={mockFn} />);

    const search = screen.getByRole("search");
    const categoryField = within(search).getByLabelText("Category");
    fireEvent.change(categoryField, { target: { value: "All" } });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ status: null, category: null });
  });
});

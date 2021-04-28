import { fireEvent, render, screen, within } from "@testing-library/react";
import { StatusEnum } from "../enums";
import SearchFilter from "./SearchFilter";

describe("Search Filter", () => {
  it("should render search filter", () => {
    render(<SearchFilter onFilterByStatus={jest.fn()} />);

    const search = screen.getByRole("search");
    const statusField = within(search).getByLabelText("Status");
    expect(statusField).toHaveDisplayValue("All");
  });

  it("should call onFilterByStatus when filter by status", () => {
    const mockFn = jest.fn();
    render(<SearchFilter onFilterByStatus={mockFn} />);

    const search = screen.getByRole("search");
    const statusField = within(search).getByLabelText("Status");
    fireEvent.change(statusField, { target: { value: StatusEnum.OPEN } });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(StatusEnum.OPEN);
  });

  it("should call onFilterByStatus with null when filter by status and select All", () => {
    const mockFn = jest.fn();
    render(<SearchFilter onFilterByStatus={mockFn} />);

    const search = screen.getByRole("search");
    const statusField = within(search).getByLabelText("Status");
    fireEvent.change(statusField, { target: { value: "All" } });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(null);
  });
});

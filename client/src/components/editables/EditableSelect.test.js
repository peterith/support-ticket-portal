import { fireEvent, render, screen, within } from "@testing-library/react";
import EditableSelect from "./EditableSelect";

describe("Editable Select", () => {
  const options = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
  ];

  it("should render editable select", () => {
    render(
      <EditableSelect options={options} onChange={jest.fn()}>
        <div data-testid="test" />
      </EditableSelect>
    );

    const children = screen.getByTestId("test");
    expect(children).toBeInTheDocument();
  });

  it("should call onChange when select option", () => {
    const mockFn = jest.fn();
    render(
      <EditableSelect options={options} onChange={mockFn}>
        <div data-testid="test" />
      </EditableSelect>
    );

    const children = screen.getByTestId("test");
    fireEvent.click(children);

    const list = screen.getByRole("listbox");
    const option = within(list).getByText("1");
    fireEvent.click(option);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("1");
  });
});

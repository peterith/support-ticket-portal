import { fireEvent, render, screen, within } from "@testing-library/react";
import EditableTextArea from "./EditableTextArea";

describe("Editable Text Area", () => {
  it("should render editable text area", () => {
    render(<EditableTextArea onBlur={jest.fn()}>Test text</EditableTextArea>);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Test text");
  });

  it("should call onBlur when blur", () => {
    const mockFn = jest.fn();
    render(<EditableTextArea onBlur={mockFn}>Test text</EditableTextArea>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const field = screen.getByRole("textbox");
    fireEvent.change(field, { target: { value: "New test text" } });
    fireEvent.blur(field);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("New test text");
  });

  it("should not call onBlur when blur and text is unchanged", () => {
    const mockFn = jest.fn();
    render(<EditableTextArea onBlur={mockFn}>Test text</EditableTextArea>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const field = screen.getByRole("textbox");
    fireEvent.blur(field);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});

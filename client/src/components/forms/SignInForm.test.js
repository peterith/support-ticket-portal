import { render, screen, fireEvent } from "@testing-library/react";
import SignInForm from "./SignInForm";

describe("Sign In Form", () => {
  it("should call onSubmit when submit form", () => {
    const mockFn = jest.fn();
    render(<SignInForm onSubmit={mockFn} />);

    const usernameField = screen.getByLabelText("Username");
    fireEvent.change(usernameField, { target: { value: "noobMaster" } });

    const passwordField = screen.getByLabelText("Password");
    fireEvent.change(passwordField, { target: { value: "password" } });

    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.click(submitButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({
      username: "noobMaster",
      password: "password",
    });
  });

  it("should render alert when submit and get error", () => {
    const mockFn = jest.fn(() => {
      throw new Error("Network error");
    });
    render(<SignInForm onSubmit={mockFn} />);

    const submitButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.click(submitButton);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Network error");
  });
});

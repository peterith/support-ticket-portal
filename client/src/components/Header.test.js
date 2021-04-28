import { render, screen, fireEvent, within } from "@testing-library/react";
import Header from "./Header";
import { AuthProvider, ModalProvider } from "../context";
import { CategoryEnum, RoleEnum } from "../enums";

describe("Header", () => {
  const appRoot = document.createElement("div");
  appRoot.id = "app-root";
  const modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  const container = document.createElement("div");
  container.append(appRoot, modalRoot);

  it("should render header", async () => {
    render(
      <AuthProvider>
        <ModalProvider>
          <Header
            onSignIn={jest.fn()}
            onSignOut={jest.fn()}
            onCreateTicket={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const header = screen.getByRole("banner");

    const logo = within(header).getByRole("heading", {
      name: "Support Ticket Portal",
    });
    expect(logo).toBeInTheDocument();

    const createButton = within(header).getByRole("button", { name: "Create" });
    expect(createButton).toBeInTheDocument();
  });

  it("should render Sign In button when no user signed in", async () => {
    render(
      <AuthProvider>
        <ModalProvider>
          <Header
            onSignIn={jest.fn()}
            onSignOut={jest.fn()}
            onCreateTicket={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const header = screen.getByRole("banner");
    const signInButton = within(header).getByRole("button", {
      name: "Sign In",
    });
    expect(signInButton).toBeInTheDocument();
  });

  it("should render username and Sign Out button when user signed in", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <Header
            onSignIn={jest.fn()}
            onSignOut={jest.fn()}
            onCreateTicket={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const header = screen.getByRole("banner");

    const username = within(header).getByText("noobMaster");
    expect(username).toBeInTheDocument();

    const signOutButton = within(header).getByRole("button", {
      name: "Sign Out",
    });
    expect(signOutButton).toBeInTheDocument();
  });

  it("should call onSignIn when sign in", async () => {
    const mockFn = jest.fn();
    render(
      <AuthProvider>
        <ModalProvider>
          <Header
            onSignIn={mockFn}
            onSignOut={jest.fn()}
            onCreateTicket={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>,
      { container: document.body.appendChild(container).firstChild }
    );

    const header = screen.getByRole("banner");
    const signInButton = within(header).getByRole("button", {
      name: "Sign In",
    });
    fireEvent.click(signInButton);

    const signInForm = screen.getByRole("dialog", { name: "Sign In" });

    const usernameField = within(signInForm).getByLabelText("Username");
    fireEvent.change(usernameField, { target: { value: "noobMaster" } });

    const passwordField = within(signInForm).getByLabelText("Password");
    fireEvent.change(passwordField, { target: { value: "password" } });

    const submitButton = within(signInForm).getByRole("button", {
      name: "Sign In",
    });
    fireEvent.click(submitButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toBeCalledWith({
      username: "noobMaster",
      password: "password",
    });
  });

  it("should call onSignOut when sign out", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <Header
            onSignIn={jest.fn()}
            onSignOut={mockFn}
            onCreateTicket={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>,
      { container: document.body.appendChild(container).firstChild }
    );

    const header = screen.getByRole("banner");
    const signOutButton = within(header).getByRole("button", {
      name: "Sign Out",
    });
    fireEvent.click(signOutButton);

    const modal = screen.getByRole("dialog", { name: "Confirmation" });
    const confirmButton = within(modal).getByRole("button", {
      name: "Confirm",
    });
    fireEvent.click(confirmButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should disable Create button when no user signed in", async () => {
    render(
      <AuthProvider>
        <ModalProvider>
          <Header
            onSignIn={jest.fn()}
            onSignOut={jest.fn()}
            onCreateTicket={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>,
      { container: document.body.appendChild(container).firstChild }
    );

    const header = screen.getByRole("banner");
    const createButton = within(header).getByRole("button", { name: "Create" });
    fireEvent.click(createButton);

    const createTicketForm = screen.queryByRole("dialog", {
      name: "Create Ticket",
    });
    expect(createTicketForm).not.toBeInTheDocument();
  });

  it("should disable Create button when user is agent", async () => {
    const initialUser = { username: "agent007", role: RoleEnum.AGENT };
    const mockFn = jest.fn();
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <Header
            onSignIn={jest.fn()}
            onSignOut={jest.fn()}
            onCreateTicket={mockFn}
          />
        </ModalProvider>
      </AuthProvider>,
      { container: document.body.appendChild(container).firstChild }
    );

    const header = screen.getByRole("banner");
    const createButton = within(header).getByRole("button", { name: "Create" });
    fireEvent.click(createButton);

    const createTicketForm = screen.queryByRole("dialog", {
      name: "Create Ticket",
    });
    expect(createTicketForm).not.toBeInTheDocument();
  });

  it("should call onCreate when create ticket", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <Header
            onSignIn={jest.fn()}
            onSignOut={jest.fn()}
            onCreateTicket={mockFn}
          />
        </ModalProvider>
      </AuthProvider>,
      { container: document.body.appendChild(container).firstChild }
    );

    const header = screen.getByRole("banner");
    const createButton = within(header).getByRole("button", { name: "Create" });
    fireEvent.click(createButton);

    const createTicketForm = screen.getByRole("dialog", {
      name: "Create Ticket",
    });

    const titleField = within(createTicketForm).getByLabelText("Title");
    fireEvent.change(titleField, { target: { value: "Title 1" } });

    const descriptionField = within(createTicketForm).getByLabelText(
      "Description"
    );
    fireEvent.change(descriptionField, { target: { value: "Description 1" } });

    const submitButton = within(createTicketForm).getByRole("button", {
      name: "Create",
    });
    fireEvent.click(submitButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({
      title: "Title 1",
      description: "Description 1",
      category: CategoryEnum.BUG,
    });
  });
});

import { render, screen, fireEvent, within } from "@testing-library/react";
import TicketDisplay from "./TicketDisplay";
import { AuthProvider, ModalProvider } from "../context";
import { StatusEnum, CategoryEnum, PriorityEnum, RoleEnum } from "../enums";

describe("Ticket Display", () => {
  const appRoot = document.createElement("div");
  appRoot.id = "app-root";
  const modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  const container = document.createElement("div");
  container.append(appRoot, modalRoot);

  const ticket = {
    id: 1,
    title: "Ticket 1",
    description: "Description 1",
    status: StatusEnum.OPEN,
    category: CategoryEnum.BUG,
    priority: PriorityEnum.MEDIUM,
    author: "noobMaster",
    agent: "agent007",
    createdAt: "2020-01-01T00:00:00",
    updatedAt: "2020-01-02T00:00:00",
  };

  const ticketNoAgent = {
    id: 1,
    title: "Ticket 1",
    description: "Description 1",
    status: StatusEnum.OPEN,
    category: CategoryEnum.BUG,
    priority: PriorityEnum.MEDIUM,
    author: "noobMaster",
    createdAt: "2020-01-01T00:00:00",
    updatedAt: "2020-01-02T00:00:00",
  };

  it("should render ticket display", () => {
    render(
      <AuthProvider>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

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
    expect(authorField).toHaveTextContent("noobMaster");

    const agentField = screen.getByLabelText("Agent");
    expect(agentField).toHaveTextContent("agent007");

    const createdField = screen.getByLabelText("Created");
    expect(createdField).toBeInTheDocument();

    const modifiedField = screen.getByLabelText("Modified");
    expect(modifiedField).toBeInTheDocument();
  });

  it("should not render update and delete components when no user signed in", () => {
    render(
      <AuthProvider>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const descriptionButton = screen.queryByRole("button", {
      name: "Description",
    });
    expect(descriptionButton).not.toBeInTheDocument();

    const statusButton = screen.queryByRole("button", { name: "Status" });
    expect(statusButton).not.toBeInTheDocument();

    const categoryButton = screen.queryByRole("button", { name: "Category" });
    expect(categoryButton).not.toBeInTheDocument();

    const priorityButton = screen.queryByRole("button", { name: "Priority" });
    expect(priorityButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByRole("button", { name: "delete" });
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("should not render Delete button and update buttons for description, category, and priority when user is not author", () => {
    const initialUser = { username: "agent007", role: RoleEnum.AGENT };
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const descriptionButton = screen.queryByRole("button", {
      name: "Description",
    });
    expect(descriptionButton).not.toBeInTheDocument();

    const statusButton = screen.getByRole("button", { name: "Status" });
    expect(statusButton).toBeInTheDocument();

    const categoryButton = screen.queryByRole("button", { name: "Category" });
    expect(categoryButton).not.toBeInTheDocument();

    const priorityButton = screen.queryByRole("button", { name: "Priority" });
    expect(priorityButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByRole("button", { name: "delete" });
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("should render update and delete components when user is author", () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const descriptionButton = screen.getByRole("button", {
      name: "Description",
    });
    expect(descriptionButton).toBeInTheDocument();

    const statusButton = screen.getByRole("button", { name: "Status" });
    expect(statusButton).toBeInTheDocument();

    const categoryButton = screen.getByRole("button", { name: "Category" });
    expect(categoryButton).toBeInTheDocument();

    const priorityButton = screen.getByRole("button", { name: "Priority" });
    expect(priorityButton).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: "delete" });
    expect(deleteButton).toBeInTheDocument();
  });

  it("should not render delete button when user is not author", () => {
    const initialUser = { username: "newbie", role: RoleEnum.CLIENT };
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const deleteButton = screen.queryByRole("button", { name: "delete" });
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("should render only Open and Closed status options when user is client", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const statusButton = screen.getByRole("button", { name: "Status" });
    fireEvent.click(statusButton);

    const statuses = screen.getByRole("listbox", { name: "Status" });

    const openStatus = within(statuses).getByText("Open");
    expect(openStatus).toBeInTheDocument();

    const inProgressStatus = within(statuses).queryByText("In Progress");
    expect(inProgressStatus).not.toBeInTheDocument();

    const resolvedStatus = within(statuses).queryByText("Resolved");
    expect(resolvedStatus).not.toBeInTheDocument();

    const closedStatus = within(statuses).getByText("Closed");
    expect(closedStatus).toBeInTheDocument();
  });

  it("should render only Open, In Progress, and Closed status options when user is agent", async () => {
    const initialUser = { username: "agent007", role: RoleEnum.AGENT };
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const statusButton = screen.getByRole("button", { name: "Status" });
    fireEvent.click(statusButton);

    const statuses = screen.getByRole("listbox", { name: "Status" });

    const openStatus = within(statuses).getByText("Open");
    expect(openStatus).toBeInTheDocument();

    const inProgressStatus = within(statuses).getByText("In Progress");
    expect(inProgressStatus).toBeInTheDocument();

    const resolvedStatus = within(statuses).getByText("Resolved");
    expect(resolvedStatus).toBeInTheDocument();

    const closedStatus = within(statuses).queryByText("Closed");
    expect(closedStatus).not.toBeInTheDocument();
  });

  it("should call onClose when close display", () => {
    const mockFn = jest.fn();
    render(
      <AuthProvider>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={mockFn}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const closeButton = screen.getByRole("button", { name: "close" });
    fireEvent.click(closeButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should call onDelete when delete ticket", () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={mockFn}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>,
      { container: document.body.appendChild(container).firstChild }
    );

    const deleteButton = screen.getByRole("button", { name: "delete" });
    fireEvent.click(deleteButton);

    const modal = screen.getByRole("dialog", { name: "Confirmation" });
    const confirmButton = within(modal).getByRole("button", {
      name: "Confirm",
    });
    fireEvent.click(confirmButton);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(ticket);
  });

  it("should call onUpdateDescription when update description", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={mockFn}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const descriptionButton = screen.getByRole("button", {
      name: "Description",
    });
    fireEvent.click(descriptionButton);

    const descriptionField = screen.getByRole("textbox", {
      name: "Description",
    });
    fireEvent.change(descriptionField, {
      target: { value: "New Description 1" },
    });
    fireEvent.blur(descriptionField);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("New Description 1");
  });

  it("should render alert when update description and get error", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn(() => {
      throw new Error("Network error");
    });
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={mockFn}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const descriptionButton = screen.getByRole("button", {
      name: "Description",
    });
    fireEvent.click(descriptionButton);

    const descriptionField = screen.getByRole("textbox", {
      name: "Description",
    });
    fireEvent.change(descriptionField, {
      target: { value: "New Description 1" },
    });
    fireEvent.blur(descriptionField);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Network error");
  });

  it("should call onUpdateStatus when update status", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={mockFn}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const statusButton = screen.getByRole("button", { name: "Status" });
    fireEvent.click(statusButton);

    const statuses = screen.getByRole("listbox", { name: "Status" });
    const closedStatus = within(statuses).getByText("Closed");
    fireEvent.click(closedStatus);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(StatusEnum.CLOSED);
  });

  it("should render alert when update status and get error", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn(() => {
      throw new Error("Network error");
    });
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={mockFn}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const statusButton = screen.getByRole("button", { name: "Status" });
    fireEvent.click(statusButton);

    const statuses = screen.getByRole("listbox", { name: "Status" });
    const closedStatus = within(statuses).getByText("Closed");
    fireEvent.click(closedStatus);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Network error");
  });

  it("should call onUpdateCategory when update category", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={mockFn}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const categoryButton = screen.getByRole("button", { name: "Category" });
    fireEvent.click(categoryButton);

    const categories = screen.getByRole("listbox", { name: "Category" });
    const technicalIssueCategory = within(categories).getByText(
      "Technical Issue"
    );
    fireEvent.click(technicalIssueCategory);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(CategoryEnum.TECHNICAL_ISSUE);
  });

  it("should render alert when update category and get error", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn(() => {
      throw new Error("Network error");
    });
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={mockFn}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const categoryButton = screen.getByRole("button", { name: "Category" });
    fireEvent.click(categoryButton);

    const categories = screen.getByRole("listbox", { name: "Category" });
    const technicalIssueCategory = within(categories).getByText(
      "Technical Issue"
    );
    fireEvent.click(technicalIssueCategory);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Network error");
  });

  it("should call onUpdatePriority when update priority", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn();
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={mockFn}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const priorityButton = screen.getByRole("button", { name: "Priority" });
    fireEvent.click(priorityButton);

    const categories = screen.getByRole("listbox", { name: "Priority" });
    const highPriority = within(categories).getByText("High");
    fireEvent.click(highPriority);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(PriorityEnum.HIGH);
  });

  it("should render alert when update priority and get error", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    const mockFn = jest.fn(() => {
      throw new Error("Network error");
    });
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticket}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={mockFn}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const priorityButton = screen.getByRole("button", { name: "Priority" });
    fireEvent.click(priorityButton);

    const categories = screen.getByRole("listbox", { name: "Priority" });
    const highPriority = within(categories).getByText("High");
    fireEvent.click(highPriority);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Network error");
  });

  it("should render assignment button when no agent and user is agent", async () => {
    const initialUser = { username: "agent007", role: RoleEnum.AGENT };
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticketNoAgent}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const assignmentButton = screen.getByRole("button", {
      name: "Assign to me",
    });
    expect(assignmentButton).toBeInTheDocument();
  });

  it("should render Unassigned when no agent and no user", async () => {
    render(
      <AuthProvider>
        <ModalProvider>
          <TicketDisplay
            ticket={ticketNoAgent}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const agentField = screen.getByLabelText("Agent");
    expect(agentField).toHaveTextContent("Unassigned");
  });

  it("should render Unassigned when no agent and user is client", async () => {
    const initialUser = { username: "noobMaster", role: RoleEnum.CLIENT };
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticketNoAgent}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={jest.fn()}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const agentField = screen.getByLabelText("Agent");
    expect(agentField).toHaveTextContent("Unassigned");
  });

  it("should call onUpdateAgent when update agent", async () => {
    const initialUser = { username: "agent007", role: RoleEnum.AGENT };
    const mockFn = jest.fn(() => {
      throw new Error("Network error");
    });
    render(
      <AuthProvider initialUser={initialUser}>
        <ModalProvider>
          <TicketDisplay
            ticket={ticketNoAgent}
            onClose={jest.fn()}
            onDelete={jest.fn()}
            onUpdateDescription={jest.fn()}
            onUpdateStatus={jest.fn()}
            onUpdateCategory={jest.fn()}
            onUpdatePriority={jest.fn()}
            onUpdateAgent={mockFn}
          />
        </ModalProvider>
      </AuthProvider>
    );

    const assignmentButton = screen.getByRole("button", {
      name: "Assign to me",
    });
    fireEvent.click(assignmentButton);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Network error");
  });
});

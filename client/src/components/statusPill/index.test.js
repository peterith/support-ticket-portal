import { render, screen } from "@testing-library/react";
import StatusPill from ".";
import { StatusEnum } from "../../enums";

describe("Status Pill", () => {
  it("should display open pill", () => {
    render(<StatusPill status={StatusEnum.OPEN} />);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("should display in progress pill", async () => {
    render(<StatusPill status={StatusEnum.IN_PROGRESS} />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("should display resolved pill", async () => {
    render(<StatusPill status={StatusEnum.RESOLVED} />);
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("should display closed pill", async () => {
    render(<StatusPill status={StatusEnum.CLOSED} />);
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });

  it("should not display pill when unknown status", async () => {
    render(<StatusPill status={""} />);
    expect(screen.queryByText("Open")).not.toBeInTheDocument();
    expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
    expect(screen.queryByText("Resolved")).not.toBeInTheDocument();
    expect(screen.queryByText("Closed")).not.toBeInTheDocument();
  });
});

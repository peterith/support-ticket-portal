import { render, screen } from "@testing-library/react";
import StatusPill from ".";
import { StatusEnum } from "../../enums";

describe("Status Pill", () => {
  it("should render open pill", () => {
    render(<StatusPill status={StatusEnum.OPEN} />);

    const openPill = screen.getByText("Open");
    expect(openPill).toBeInTheDocument();
  });

  it("should render in progress pill", async () => {
    render(<StatusPill status={StatusEnum.IN_PROGRESS} />);

    const inProgressPill = screen.getByText("In Progress");
    expect(inProgressPill).toBeInTheDocument();
  });

  it("should render resolved pill", async () => {
    render(<StatusPill status={StatusEnum.RESOLVED} />);

    const resolvedPill = screen.getByText("Resolved");
    expect(resolvedPill).toBeInTheDocument();
  });

  it("should render closed pill", async () => {
    render(<StatusPill status={StatusEnum.CLOSED} />);

    const closedPill = screen.getByText("Closed");
    expect(closedPill).toBeInTheDocument();
  });

  it("should not render pill when unknown status", async () => {
    render(<StatusPill status="" />);

    const openPill = screen.queryByText("Open");
    const inProgressPill = screen.queryByText("In Progress");
    const resolvedPill = screen.queryByText("Resolved");
    const closedPill = screen.queryByText("Closed");

    expect(openPill).not.toBeInTheDocument();
    expect(inProgressPill).not.toBeInTheDocument();
    expect(resolvedPill).not.toBeInTheDocument();
    expect(closedPill).not.toBeInTheDocument();
  });
});

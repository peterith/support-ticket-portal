import { render, screen } from "@testing-library/react";
import PriorityDisplay from "./PriorityDisplay";
import { PriorityEnum } from "../enums";

describe("Priority Display", () => {
  it("should render low priority", () => {
    render(<PriorityDisplay priority={PriorityEnum.LOW} />);

    const lowPriority = screen.getByRole("img", { name: "low priority" });
    expect(lowPriority).toBeInTheDocument();
  });

  it("should render medium priority", async () => {
    render(<PriorityDisplay priority={PriorityEnum.MEDIUM} />);

    const mediumPriority = screen.getByRole("img", { name: "medium priority" });
    expect(mediumPriority).toBeInTheDocument();
  });

  it("should render high priority", async () => {
    render(<PriorityDisplay priority={PriorityEnum.HIGH} />);

    const highPriority = screen.getByRole("img", { name: "high priority" });
    expect(highPriority).toBeInTheDocument();
  });

  it("should not render priority when unknown priority", async () => {
    render(<PriorityDisplay priority="" />);

    const priority = screen.queryByRole("img", { name: /priority/i });
    expect(priority).not.toBeInTheDocument();
  });
});

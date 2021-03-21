import { render, screen } from "@testing-library/react";
import PriorityDisplay from "./PriorityDisplay";
import { PriorityEnum } from "../enums";

describe("Priority Display", () => {
  it("should display low priority", () => {
    render(<PriorityDisplay priority={PriorityEnum.LOW} />);
    expect(screen.getByRole("img", "low priority")).toBeInTheDocument();
  });

  it("should display medium priority", async () => {
    render(<PriorityDisplay priority={PriorityEnum.MEDIUM} />);
    expect(screen.getByRole("img", "medium priority")).toBeInTheDocument();
  });

  it("should display high priority", async () => {
    render(<PriorityDisplay priority={PriorityEnum.HIGH} />);
    expect(screen.getByRole("img", "high priority")).toBeInTheDocument();
  });

  it("should not display priority when unknown priority", async () => {
    render(<PriorityDisplay priority="" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

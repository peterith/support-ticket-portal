import { render, screen } from "@testing-library/react";
import CategoryPill from ".";
import { CategoryEnum } from "../../enums";

describe("Category Pill", () => {
  it("should display bug pill", () => {
    render(<CategoryPill category={CategoryEnum.BUG} />);
    expect(screen.getByText("BUG")).toBeInTheDocument();
  });

  it("should display feature request pill", async () => {
    render(<CategoryPill category={CategoryEnum.FEATURE_REQUEST} />);
    expect(screen.getByText("FEATURE REQUEST")).toBeInTheDocument();
  });

  it("should display technical issue pill", async () => {
    render(<CategoryPill category={CategoryEnum.TECHNICAL_ISSUE} />);
    expect(screen.getByText("TECHNICAL ISSUE")).toBeInTheDocument();
  });

  it("should display account pill", async () => {
    render(<CategoryPill category={CategoryEnum.ACCOUNT} />);
    expect(screen.getByText("ACCOUNT")).toBeInTheDocument();
  });

  it("should not display pill when unknown category", async () => {
    render(<CategoryPill category={""} />);
    expect(screen.queryByText("BUG")).not.toBeInTheDocument();
    expect(screen.queryByText("FEATURE REQUEST")).not.toBeInTheDocument();
    expect(screen.queryByText("TECHNICAL ISSUE")).not.toBeInTheDocument();
    expect(screen.queryByText("ACCOUNT")).not.toBeInTheDocument();
  });
});

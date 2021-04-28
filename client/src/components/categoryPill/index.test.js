import { render, screen } from "@testing-library/react";
import CategoryPill from ".";
import { CategoryEnum } from "../../enums";

describe("Category Pill", () => {
  it("should render bug pill", () => {
    render(<CategoryPill category={CategoryEnum.BUG} />);

    const bugPill = screen.getByText("BUG");
    expect(bugPill).toBeInTheDocument();
  });

  it("should render feature request pill", async () => {
    render(<CategoryPill category={CategoryEnum.FEATURE_REQUEST} />);

    const featureRequestPill = screen.getByText("FEATURE REQUEST");
    expect(featureRequestPill).toBeInTheDocument();
  });

  it("should render technical issue pill", async () => {
    render(<CategoryPill category={CategoryEnum.TECHNICAL_ISSUE} />);

    const technicalIssuePill = screen.getByText("TECHNICAL ISSUE");
    expect(technicalIssuePill).toBeInTheDocument();
  });

  it("should render account pill", async () => {
    render(<CategoryPill category={CategoryEnum.ACCOUNT} />);

    const accountPill = screen.getByText("ACCOUNT");
    expect(accountPill).toBeInTheDocument();
  });

  it("should not render pill when unknown category", async () => {
    render(<CategoryPill category="" />);

    const bugPill = screen.queryByText("BUG");
    const featureRequestPill = screen.queryByText("FEATURE REQUEST");
    const technicalIssuePill = screen.queryByText("TECHNICAL ISSUE");
    const accountPill = screen.queryByText("ACCOUNT");

    expect(bugPill).not.toBeInTheDocument();
    expect(featureRequestPill).not.toBeInTheDocument();
    expect(technicalIssuePill).not.toBeInTheDocument();
    expect(accountPill).not.toBeInTheDocument();
  });
});

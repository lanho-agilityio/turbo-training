import { render, screen } from "@testing-library/react";

// Components
import { StatisticCard } from "./index";

// Icons
import { HomeIcon } from "@repo/ui/icons/HomeIcon";

describe("StatisticCard component", () => {
  test("renders the StatisticCard with children", () => {
    render(
      <StatisticCard
        path="/"
        variant="warning"
        icon={<HomeIcon customClass="w-5 h-5" />}
        label="Priority Task"
        description="23/34 Task"
      />
    );
    expect(screen.getByText("Priority Task")).toBeInTheDocument();
    expect(screen.getByText("23/34 Task")).toBeInTheDocument();
  });

  test("renders icon", () => {
    render(
      <StatisticCard
        path="/"
        variant="warning"
        icon={<div>Icon</div>}
        label="Priority Task"
        description="23/34 Task"
      />
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  test("applies the correct theme classes", () => {
    render(
      <StatisticCard
        path="/"
        variant="warning"
        icon={<div>Icon</div>}
        label="Priority Task"
        description="23/34 Task"
        customClass={{
          desciption: "text-white",
          icon: "mt-2",
          title: "text-zinc-800",
          wrapper: "rounded-md",
        }}
      />
    );
    expect(screen.getByTestId("statisticCard")).toHaveClass(
      "flex flex-col rounded-md pl-[12.5px] pr-[21.5px] py-[11px] bg-yellow-100"
    );
    expect(screen.getByTestId("icon-wrapper")).toHaveClass("mt-2");
    expect(screen.getByTestId("title-text")).toHaveClass("text-zinc-800");
    expect(screen.getByTestId("description-text")).toHaveClass("text-white");
  });
});

import { render, screen } from "@testing-library/react";

// Components
import { OverviewCard } from "./index";
import { Badge } from "../Badge";

// Constants
import { OPEN_GRAPH_IMAGE } from "@repo/ui/constants/images";
import { DATE_FORMAT } from "@repo/ui/constants/dates";
import { MOCK_OVERVIEW_CARD_DATA } from "@repo/ui/constants/mocks";

// Icons
import { ClockIcon } from "@repo/ui/icons/ClockIcon";

// Utils
import { formatDate } from "@repo/ui/utils/dates";

describe("OverviewCard component", () => {
  test("renders the OverviewCard match snapshot", () => {
    const { container, getByTestId } = render(
      <OverviewCard
        href="/"
        imageSrc={OPEN_GRAPH_IMAGE}
        avatarSrc="/avatar.png"
        title={MOCK_OVERVIEW_CARD_DATA.title}
        description={MOCK_OVERVIEW_CARD_DATA.description}
        time={formatDate(MOCK_OVERVIEW_CARD_DATA.createdAt, DATE_FORMAT.Hour)}
        isRowDisplay={false}
        customClass={{
          avatar: "rounded-md",
          description: "text-white",
          helperText: "text-neutral-700",
          image: "rounder-md",
          time: "text-white",
          title: "text-white",
          wrapper: "border-2",
        }}
        badge={
          <Badge
            label="Design Project"
            icon={<ClockIcon />}
            customClass="rounded-md text-white text-sm"
          />
        }
      />
    );
    const cardWrapper = getByTestId("card-wrapper");
    const imageWrapper = getByTestId("image-wrapper");
    const titleText = getByTestId("title-text");
    const helperText = getByTestId("helper-text");
    const descriptionText = getByTestId("description-text");
    const avatarElement = getByTestId("avatar-element");
    const timeElement = getByTestId("time-display");

    // Check if elements are in the document
    expect(cardWrapper).toBeInTheDocument();
    expect(imageWrapper).toBeInTheDocument();
    expect(titleText).toBeInTheDocument();
    expect(helperText).toBeInTheDocument();
    expect(descriptionText).toBeInTheDocument();
    expect(avatarElement).toBeInTheDocument();
    expect(timeElement).toBeInTheDocument();

    // Check if elements have the correct custom classes
    expect(cardWrapper).toHaveClass("border-2");
    expect(imageWrapper).toHaveClass("rounder-md");
    expect(titleText).toHaveClass("text-white");
    expect(helperText).toHaveClass("text-neutral-700");
    expect(descriptionText).toHaveClass("text-white");
    expect(avatarElement).toHaveClass("rounded-md");
    expect(timeElement).toHaveClass("text-white");
    expect(container).toMatchSnapshot();
  });

  test("renders the OverviewCard with children", () => {
    render(
      <OverviewCard
        href="/"
        title={MOCK_OVERVIEW_CARD_DATA.title}
        description={MOCK_OVERVIEW_CARD_DATA.description}
        time={formatDate(MOCK_OVERVIEW_CARD_DATA.createdAt, DATE_FORMAT.Hour)}
        isRowDisplay={true}
        badge={
          <Badge
            label="Design Project"
            icon={<ClockIcon />}
            customClass="rounded-md text-white text-sm"
          />
        }
      />
    );
    expect(screen.getByText("Design Project")).toBeInTheDocument();
    expect(
      screen.getByText(
        formatDate(MOCK_OVERVIEW_CARD_DATA.createdAt, DATE_FORMAT.Hour)
      )
    ).toBeInTheDocument();
  });
});

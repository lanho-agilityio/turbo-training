import { render, screen, fireEvent } from "@testing-library/react";

// Types
import { OptionType } from "@repo/ui/types/components";

// Component
import { Dropdown } from ".";

const SORT_OPTIONS: OptionType[] = [
  {
    name: "Desc",
    value: "desc",
  },
  {
    name: "Asc",
    value: "asc",
  },
];

const mockProps = {
  options: SORT_OPTIONS,
  onSelect: jest.fn(),
};

describe("Dropdown component", () => {
  test("Render component correctly", () => {
    expect(render(<Dropdown {...mockProps} />)).toMatchSnapshot();
  });

  test("Show the selected item", () => {
    const { getByText } = render(
      <Dropdown {...mockProps} selectedItemValue="desc" />
    );
    const comp = getByText("Desc");
    expect(comp).toBeInTheDocument();
  });

  test("Show list options", async () => {
    render(<Dropdown {...mockProps} />);
    const button = screen.getByRole("button");
    await fireEvent.click(button);
    const options = screen.getByTestId("options");
    expect(options).toBeInTheDocument();
  });

  test("Should render correct number of options", async () => {
    render(<Dropdown {...mockProps} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    await fireEvent.click(button);
    const options = screen.getByTestId("options");
    expect(options.children).toHaveLength(SORT_OPTIONS.length);
  });

  test("Should call onSelect function", async () => {
    render(<Dropdown {...mockProps} />);
    const button = screen.getByRole("button");
    await fireEvent.click(button);
    await fireEvent.click(screen.getByText("Desc"));
    expect(mockProps.onSelect).toHaveBeenCalledTimes(1);
  });
});

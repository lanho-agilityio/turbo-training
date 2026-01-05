import { act, fireEvent, render, screen } from "@testing-library/react";

// Components
import { MultipleSelect } from ".";
import { Button } from "@repo/ui/components/Button";

const PRIORITY_OPTIONS = [
  {
    name: "Low",
    value: "low",
  },

  {
    name: "High",
    value: "high",
  },
  {
    name: "Medium",
    value: "medium",
  },
];

const mockSelectedOptions = ["low", "medium"];

const defaultProps = {
  id: "dropdown",
  label: "Select options",
  options: PRIORITY_OPTIONS,
  onChange: jest.fn(),
  onBlur: jest.fn(),
};

describe("Dropdown Component", () => {
  test("Should match snapshot", () => {
    const comp = render(<MultipleSelect {...defaultProps} />);
    expect(comp).toMatchSnapshot();
  });

  test("Should match snapshot when disable", () => {
    const comp = render(<MultipleSelect {...defaultProps} disabled />);
    expect(comp).toMatchSnapshot();
  });

  test("Should have class when passing customClass prop", () => {
    const { getByTestId } = render(
      <MultipleSelect
        {...defaultProps}
        customClass={{
          wrapper: "bg-black",
        }}
      />
    );
    const wrapper = getByTestId("multiple-select");
    expect(wrapper).toHaveClass("bg-black");
  });

  test("Should show the title", () => {
    const { getByText } = render(
      <MultipleSelect {...defaultProps} title="Priority" />
    );
    const comp = getByText("Priority");
    expect(comp).toBeInTheDocument();
  });

  test("Should show options", async () => {
    render(<MultipleSelect {...defaultProps} />);
    const text = screen.getByTestId("multiple-select");
    await fireEvent.click(text);
    const options = screen.getByTestId("options");
    expect(options).toBeInTheDocument();
  });

  test("Should have class style when not passing title", async () => {
    const { getByTestId } = render(
      <MultipleSelect
        {...defaultProps}
        customClass={{
          dropdown: "mb-2",
        }}
      />
    );
    const text = getByTestId("multiple-select");
    fireEvent.click(text);
    const listOptions = getByTestId("options");
    const optionLow = getByTestId("option-low");
    expect(optionLow).toBeInTheDocument();
    fireEvent.click(optionLow);
    const selectedOptionsWrapper = getByTestId("selected-options-wrapper");
    expect(listOptions).toBeInTheDocument();
    expect(selectedOptionsWrapper).toBeInTheDocument();
    expect(selectedOptionsWrapper).toHaveClass("py-[14px]");
    expect(listOptions).toHaveClass("mb-2");
  });

  test("Should have class style when not passing title", async () => {
    const { getByTestId } = render(
      <MultipleSelect {...defaultProps} title="Priority" />
    );
    const text = getByTestId("multiple-select");
    fireEvent.click(text);
    const optionLow = getByTestId("option-low");
    expect(optionLow).toBeInTheDocument();
    fireEvent.click(optionLow);
    const selectedOptionsWrapper = getByTestId("selected-options-wrapper");
    expect(selectedOptionsWrapper).toBeInTheDocument();
    expect(selectedOptionsWrapper).toHaveClass("py-[5px]");
  });

  test("Should render correct number of options", async () => {
    render(<MultipleSelect {...defaultProps} />);
    const text = screen.getByTestId("multiple-select");
    await fireEvent.click(text);
    const options = screen.getByTestId("options");
    expect(options.children).toHaveLength(PRIORITY_OPTIONS.length);
  });

  test("Should call onSelect when select option", async () => {
    const { getByTestId, getByText } = render(
      <div>
        <MultipleSelect
          {...defaultProps}
          selectedOptions={mockSelectedOptions}
        />
        <Button onClick={jest.fn()}>Click me</Button>
      </div>
    );
    const text = getByTestId("multiple-select");
    fireEvent.click(text);
    const selectedOption = getByTestId("multiple-select-low");
    fireEvent.click(selectedOption);
    const button = getByText("Click me");

    await act(() => fireEvent.mouseDown(button));
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onBlur).toHaveBeenCalledTimes(1);
  });

  test("Should call onRemove when remove selected option", async () => {
    const { getByTestId, getByText } = render(
      <div>
        <MultipleSelect
          {...defaultProps}
          selectedOptions={mockSelectedOptions}
        />
        <Button onClick={jest.fn()}>Click me</Button>
      </div>
    );
    const text = getByTestId("multiple-select");
    fireEvent.click(text);
    const selectedOption = getByTestId("multiple-select-medium");
    fireEvent.click(selectedOption);
    const button = getByText("Click me");

    await act(() => fireEvent.mouseDown(button));
    expect(defaultProps.onChange).toHaveBeenCalledTimes(2);
  });
});

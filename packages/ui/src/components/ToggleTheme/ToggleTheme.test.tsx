import { fireEvent, render } from "@testing-library/react";
import { useTheme } from "next-themes";

// Components
import { ToggleTheme } from "./index";

// Constants
import { THEME_MODE } from "@repo/ui/constants/theme";

// Mock useTheme hook
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ToggleTheme component", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSetTheme: any;

  beforeEach(() => {
    mockSetTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: THEME_MODE.LIGHT,
      setTheme: mockSetTheme,
    });
  });

  test("renders the ToggleTheme match snapshot", () => {
    const { asFragment } = render(<ToggleTheme />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("should trigger function when click", () => {
    const { getByTestId } = render(<ToggleTheme />);
    const buttonChangeTheme = getByTestId("toggle-theme-button");

    fireEvent.click(buttonChangeTheme);
    expect(mockSetTheme).toHaveBeenCalledWith(THEME_MODE.DARK);
  });

  test("renders correct icon based on theme", () => {
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: THEME_MODE.DARK,
      setTheme: mockSetTheme,
    });

    const { getByTestId } = render(<ToggleTheme />);
    const lightModeIcon = getByTestId("dark-theme-icon");
    expect(lightModeIcon).toBeInTheDocument();

    const buttonChangeTheme = getByTestId("toggle-theme-button");
    fireEvent.click(buttonChangeTheme);
    expect(mockSetTheme).toHaveBeenCalledWith(THEME_MODE.LIGHT);
  });
});

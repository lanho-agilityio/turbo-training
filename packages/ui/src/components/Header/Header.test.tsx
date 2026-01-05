import { fireEvent, render, screen } from "@testing-library/react";

// Components
import { Header } from ".";

// Constants
import { MOCK_AVATAR_LINK } from "@repo/ui/constants/mocks";

const mockProps = {
  name: "test user",
  avatarUrl: MOCK_AVATAR_LINK,
  handleSearch: jest.fn(),
};

describe("Header component", () => {
  test("Should match snapshot", () => {
    const comp = render(<Header {...mockProps} />);
    expect(comp).toMatchSnapshot();
  });

  test("Should call handleSearch function", () => {
    render(<Header {...mockProps} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Test input" },
    });
    expect(mockProps.handleSearch).toHaveBeenCalledTimes(1);
  });
});

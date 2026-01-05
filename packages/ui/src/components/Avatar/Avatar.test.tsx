import { render, screen } from "@testing-library/react";

// Components
import { Avatar } from ".";

// Constants
import { MOCK_AVATAR_LINK } from "@repo/ui/constants/mocks";

const mockProps = {
  src: MOCK_AVATAR_LINK,
  name: "test user",
};

describe("Avatar component", () => {
  test("Should match snapshot", () => {
    const comp = render(<Avatar {...mockProps} />);
    expect(comp).toMatchSnapshot();
  });

  test("Should has correct customClass", () => {
    render(<Avatar {...mockProps} customClass="custom-class" />);
    expect(screen.getByRole("img")).toHaveClass("custom-class");
  });

  test("Should render correct variant", () => {
    render(<Avatar {...mockProps} variant="circle" />);
    expect(screen.getByRole("img")).toHaveClass("rounded-full");
  });

  test("Should render fallback image", () => {
    const expectSrc = expect.stringContaining("ui-avatars.com");
    render(<Avatar name="test user" />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("srcset", expectSrc);
  });
});

import { render, screen } from "@testing-library/react";

// Components
import { AvatarGroup } from ".";

// Constants
import { MOCK_PARTICIPATIONS } from "@repo/ui/constants/mocks";

describe("AvatarGroup component", () => {
  test("Should match snapshot", () => {
    expect(
      render(<AvatarGroup listUsers={MOCK_PARTICIPATIONS} />)
    ).toMatchSnapshot();
  });

  test("Should show correct shorten items", () => {
    render(<AvatarGroup listUsers={MOCK_PARTICIPATIONS} maxDisplayed={3} />);
    const comp = screen.getByTestId("avatar-group");
    expect(comp.children).toHaveLength(4);
  });
});

import { render, screen } from "@testing-library/react";

// Components
import ImageWithFallback from "./index";

// Constants
import { MOCK_IMAGE_LINK } from "@repo/ui/constants/mocks";

describe("ImageWithFallback component", () => {
  test("renders the ImageWithFallback with correct attributes", () => {
    const alt = "test";
    render(
      <ImageWithFallback
        src={MOCK_IMAGE_LINK}
        alt={alt}
        width={400}
        height={300}
      />
    );
    const img = screen.getByAltText(alt);
    expect(img.getAttribute("width")).toBe("400");
    expect(img.getAttribute("height")).toBe("300");
  });
});

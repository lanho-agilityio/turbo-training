// Next
import Image from "next/image";

import { render, screen, fireEvent } from "@testing-library/react";

// Hocs
import {
  withFallbackImage,
  WithFallbackImageProps,
} from "@repo/ui/hocs/withFallbackImage";

const MockImageComponent = ({ src, onError, alt }: WithFallbackImageProps) => (
  <Image
    width={40}
    height={30}
    src={src}
    onError={onError}
    alt={alt}
    data-testid="image"
  />
);

describe("withFallbackImage", () => {
  const fallbackSrc = "/not-found.svg";
  const WrappedComponent = withFallbackImage(MockImageComponent, fallbackSrc);

  it("should render the image with the provided src", () => {
    const src = "/original-image.png";
    const { asFragment, getByTestId } = render(
      <WrappedComponent src={src} alt="image to test" />
    );

    const img = getByTestId("image");
    expect(img).toHaveAttribute("alt", "image to test");
    expect(asFragment()).toMatchSnapshot();
  });

  it("should set the fallback src on error", () => {
    const src = "/original-image.png";
    render(<WrappedComponent src={src} alt="test" />);

    const img = screen.getByTestId("image");
    fireEvent.error(img);

    expect(img).toHaveAttribute("src", "http://localhost/not-found.svg");
  });
});

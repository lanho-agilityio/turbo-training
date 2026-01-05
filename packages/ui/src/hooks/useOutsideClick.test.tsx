import { ReactNode, useRef } from "react";
import { fireEvent, renderHook } from "@testing-library/react";

// Hooks
import { useOutsideClick } from "@repo/ui/hooks/useOutsideClick";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn().mockReturnValue({ current: document.createElement("div") }),
}));

describe("useOutsideClick", () => {
  test("Calls the callback when clicking outside the element", () => {
    const callback = jest.fn();
    const ref = useRef<HTMLDivElement>(null);
    const wrapper = ({ children }: { children: ReactNode }) => {
      return <div ref={ref}>{children}</div>;
    };

    renderHook(() => useOutsideClick(callback), {
      wrapper,
    });

    fireEvent.mouseDown(document);

    expect(callback).toHaveBeenCalled();
  });

  test("Not Call the callback when clicking outside the element", () => {
    const callback = jest.fn();
    const wrapper = ({ children }: { children: ReactNode }) => {
      return <div>{children}</div>;
    };

    renderHook(() => useOutsideClick(callback), {
      wrapper,
    });

    fireEvent.mouseDown(document);

    expect(callback).not.toHaveBeenCalled();
  });
});

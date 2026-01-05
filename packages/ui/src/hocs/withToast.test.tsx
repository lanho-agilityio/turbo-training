import { render, screen, waitFor } from "@testing-library/react";

// Hoc
import { withToast, TWithToast } from "@repo/ui/hocs/withToast";

const mockCallback = jest.fn();

const MockButtonChild = <T,>({ openToast }: TWithToast<T>) => (
  <button
    onClick={() =>
      openToast({ message: "Toast here", variant: "success" }, mockCallback)
    }
    data-testid="button-element"
  >
    Trigger Toast
  </button>
);

jest.useFakeTimers();

describe("withToast", () => {
  const WrappedComponent = withToast(MockButtonChild);

  it("should render button component", async () => {
    render(<WrappedComponent />);
    const button = screen.getByTestId("button-element");
    expect(button).toBeInTheDocument();

    button.click();

    await waitFor(() => {
      expect(screen.queryByText("Toast here")).toBeInTheDocument();
    });

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.queryByText("Toast here")).not.toBeInTheDocument();
    });
  });

  it("should call callback after toast closes", async () => {
    render(<WrappedComponent />);
    const button = screen.getByTestId("button-element");
    expect(button).toBeInTheDocument();

    button.click();

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});

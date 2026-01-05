import { fireEvent, render, screen } from "@testing-library/react";

// Component
import { BaseModal } from ".";

const defaultProps = {
  title: "Title",
  isOpen: true,
  onClose: jest.fn(),
};

describe("BaseModal Component", () => {
  test("Should match snapshot", () => {
    const { asFragment } = render(
      <BaseModal
        {...defaultProps}
        customClass={{
          overlay: "bg-neutral-300",
          modalWrappper: "rounded-md",
          title: "text-white",
          content: "text-zinc-700",
          button: "bg-blue-500",
        }}
      >
        <span>Content</span>
      </BaseModal>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.title)).toHaveClass("text-white");
    expect(screen.getByTestId("modal")).toHaveClass("rounded-md");
    expect(screen.getByTestId("close-button")).toHaveClass("bg-blue-500");
    expect(screen.getByTestId("modal-overlay")).toHaveClass("bg-neutral-300");
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  test("Should not render when isOpen props is false", () => {
    const { asFragment } = render(
      <BaseModal {...defaultProps} isOpen={false}>
        <span>Content</span>
      </BaseModal>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("Should call onClose when click close button", () => {
    render(
      <BaseModal {...defaultProps}>
        <span>Content</span>
      </BaseModal>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test("should call the onClose function when the user clicks outside the modal", () => {
    render(
      <BaseModal {...defaultProps}>
        <span>Content</span>
      </BaseModal>
    );
    const body = document.querySelector("body") as HTMLBodyElement;

    fireEvent.mouseDown(body);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test("should call the onClose function when the user press escape on keyboard", () => {
    render(
      <BaseModal {...defaultProps}>
        <span>Content</span>
      </BaseModal>
    );
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});

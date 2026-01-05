import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";

// Components
import { Pagination, PaginationWrapper } from "./index";

// Hooks
import { useCombinedSearchParams } from "@repo/ui/hooks/useCombinedSearchParams";

jest.mock("next/navigation", () => {
  const originalModule = jest.requireActual("next/navigation");

  return {
    ...originalModule,
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
  };
});

describe("Pagination component", () => {
  test("renders the Pagination with children", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        onChangePageNumber={() => {}}
        pageSize={3}
        siblingCount={2}
        total={50}
        variant="outline"
      />
    );
    expect(container).toMatchSnapshot();
  });

  test("handles click events", () => {
    const handleClick = jest.fn();
    render(
      <Pagination
        currentPage={1}
        onChangePageNumber={handleClick}
        pageSize={3}
        siblingCount={2}
        total={50}
        variant="outline"
      />
    );
    fireEvent.click(screen.getByText("1"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("disables click events", () => {
    const handleClick = jest.fn();
    render(
      <Pagination
        currentPage={1}
        customClass={{}}
        onChangePageNumber={handleClick}
        pageSize={3}
        siblingCount={2}
        total={50}
        startIcon={<span>Start</span>}
        variant="outline"
      />
    );
    fireEvent.click(screen.getByText("Previous"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("should trigger event", () => {
    const handleClick = jest.fn();
    render(
      <Pagination
        currentPage={5}
        customClass={{}}
        onChangePageNumber={handleClick}
        pageSize={10}
        siblingCount={2}
        total={100}
      />
    );
    fireEvent.click(screen.getByText("Next"));
    expect(handleClick).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("Previous"));
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  test("should render match snapshot when total page === 0", () => {
    const handleClick = jest.fn();
    const { asFragment } = render(
      <Pagination
        currentPage={0}
        customClass={{}}
        onChangePageNumber={handleClick}
        pageSize={0}
        siblingCount={0}
        total={0}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

jest.mock("./../../hooks/useCombinedSearchParams", () => ({
  useCombinedSearchParams: jest.fn(),
}));

describe("PaginationWrapper component", () => {
  const mockUseRouter = useRouter as jest.Mock;
  mockUseRouter.mockReturnValue({
    push: jest.fn(),
  });
  const mockUseSearchParams = new URLSearchParams({
    page: "1",
  });

  const mockUseCombinedSearchParams = {
    setQueryParams: jest.fn().mockImplementation((queryParam) => {
      const updatedQuery = new URLSearchParams({
        page: "1",
        ...queryParam,
      });
      return updatedQuery.toString();
    }),
  };
  beforeEach(() => {
    // Reset the mock implementations before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockUseRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockUseSearchParams);
    (useCombinedSearchParams as jest.Mock).mockReturnValue(
      mockUseCombinedSearchParams
    );
  });

  test("should render match snapshot", () => {
    const { asFragment } = render(
      <PaginationWrapper pageSize={10} total={30} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

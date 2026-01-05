import { act, renderHook } from "@testing-library/react";
import { useSearchParams } from "next/navigation";

// Hooks
import { useCombinedSearchParams } from "@repo/ui/hooks/useCombinedSearchParams";
import { getQueryParams, QueryParam } from "@repo/ui/utils/queryParams";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@repo/ui/utils/queryParams", () => ({
  getQueryParams: jest.fn(),
}));

describe("useCombinedSearchParams", () => {
  it("should return setQueryParams function", () => {
    const searchParamsMock = new URLSearchParams({ priority: "high" });
    (useSearchParams as jest.Mock).mockReturnValue(searchParamsMock);

    const { result } = renderHook(() => useCombinedSearchParams());

    expect(result.current).toHaveProperty("setQueryParams");
    expect(typeof result.current.setQueryParams).toBe("function");
  });

  it("should update query parameters correctly", () => {
    const searchParamsMock = new URLSearchParams({ priority: "high" });
    (useSearchParams as jest.Mock).mockReturnValue(searchParamsMock);

    const updatedParams: QueryParam = { status: "done" };

    const updatedQueryMock = { priority: "high", status: "done" };

    (getQueryParams as jest.Mock).mockReturnValue(updatedQueryMock);

    const { result } = renderHook(() => useCombinedSearchParams());

    let updatedQuery;
    act(() => {
      updatedQuery = result.current.setQueryParams(updatedParams);
    });

    expect(updatedQuery).toEqual(updatedQueryMock);
  });
});

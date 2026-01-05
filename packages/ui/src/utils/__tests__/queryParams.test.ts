import { getQueryParams, getSearchParams } from "@repo/ui/utils/queryParams";

describe("getQueryParams function", () => {
  it("returns empty string for empty query parameters", () => {
    const result = getQueryParams({});
    expect(result).toBe("");
  });

  it("correctly generates query parameters for query parameters", () => {
    const queryParams = {
      priority: "low",
      status: "done",
    };
    const result = getQueryParams(queryParams);
    expect(result).toBe("?priority=low&status=done");
  });

  it("ignores empty values in query parameters", () => {
    const queryParams = {
      priority: "low",
      status: "done",
      sort: undefined,
    };
    const result = getQueryParams(queryParams);
    expect(result).toBe("?priority=low&status=done");
  });

  it("handles special characters and encoding in values", () => {
    const queryParams = {
      priority: "low",
      status: "done&2",
      sort: "desc#3",
    };
    const result = getQueryParams(queryParams);
    expect(result).toBe("?priority=low&status=done%262&sort=desc%233");
  });
});

describe("getSearchParams function", () => {
  it("returns an empty object for empty search parameters", () => {
    const searchParams = new URLSearchParams("");
    const result = getSearchParams(searchParams);
    expect(result).toEqual({});
  });

  it("correctly converts search parameters into an object", () => {
    const searchParams = new URLSearchParams("priority=low&status=done");
    const result = getSearchParams(searchParams);
    expect(result).toEqual({ priority: "low", status: "done" });
  });

  it("handles special characters and decoding in values", () => {
    const searchParams = new URLSearchParams(
      "priority=low&status=done%262&sort=desc%233"
    );
    const result = getSearchParams(searchParams);
    expect(result).toEqual({
      priority: "low",
      status: "done&2",
      sort: "desc#3",
    });
  });

  it("handles duplicate keys by overriding with the last value", () => {
    const searchParams = new URLSearchParams("priority=low&priority=high");
    const result = getSearchParams(searchParams);
    expect(result).toEqual({ priority: "high" });
  });

  it("handles numeric values and other data types", () => {
    const searchParams = new URLSearchParams("projectId=123&priority=medium");
    const result = getSearchParams<{ [key: string]: string | boolean }>(
      searchParams
    );
    expect(result).toEqual({ projectId: "123", priority: "medium" });
  });
});

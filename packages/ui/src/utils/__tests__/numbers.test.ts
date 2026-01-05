import { getNumRange } from "@repo/ui/utils/numbers";

describe("getNumRange function", () => {
  it("returns an array with numbers from 1 to 5", () => {
    const result = getNumRange(1, 5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns an array with numbers from -3 to 3", () => {
    const result = getNumRange(-3, 3);
    expect(result).toEqual([-3, -2, -1, 0, 1, 2, 3]);
  });

  it("returns an empty array when start is greater than end", () => {
    const result = getNumRange(5, 1);
    expect(result).toEqual([]);
  });

  it("returns an array with a single number when start equals end", () => {
    const result = getNumRange(3, 3);
    expect(result).toEqual([3]);
  });

  it("returns an array with numbers from 0 to 2", () => {
    const result = getNumRange(0, 2);
    expect(result).toEqual([0, 1, 2]);
  });

  it("returns an empty array when start and end are both 0", () => {
    const result = getNumRange(0, 0);
    expect(result).toEqual([0]);
  });
});

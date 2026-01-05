import dayjs from "dayjs";
import { formatDate } from "@repo/ui/utils/dates";
import { DATE_FORMAT } from "@repo/ui/constants/dates";

jest.mock("dayjs", () =>
  jest.fn(() => ({
    format: jest.fn(),
  }))
);

describe("formatDate utility function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("formats a valid date string with default format", () => {
    formatDate("2023-01-15");
    expect(dayjs).toHaveBeenCalledWith(new Date("2023-01-15"));
  });

  it("formats a valid date string with custom format", () => {
    formatDate("2023-01-15", DATE_FORMAT.Tertiary);
    expect(dayjs).toHaveBeenCalledWith(new Date("2023-01-15"));
  });

  it("formats a valid Date object with default format", () => {
    const dateObject = new Date("2023-02-28");
    formatDate(dateObject);

    expect(dayjs).toHaveBeenCalledWith(dateObject);
  });

  it("formats a valid Date object with custom format", () => {
    const dateObject = new Date("2023-02-28");
    formatDate(dateObject, DATE_FORMAT.Secondary);

    expect(dayjs).toHaveBeenCalledWith(dateObject);
  });
});

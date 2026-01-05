import {
  isEmpty,
  isRequired,
  isValidFormat,
  isEnableSubmitButton,
  setServerActionErrors,
} from "@repo/ui/utils/validators";

// Constants
import { REGEX_EMAIL } from "@repo/ui/constants/regex";

describe("isRequired function", () => {
  it("returns true for non-empty string", () => {
    expect(isRequired("hello")).toBe(true);
  });

  it("returns true for non-empty string with whitespace", () => {
    expect(isRequired("   test  ")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(isRequired("")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isRequired(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isRequired(undefined)).toBe(false);
  });
});

describe("isValidFormat function", () => {
  it("returns true for empty value and any pattern", () => {
    expect(isValidFormat("", REGEX_EMAIL)).toBe(true);
  });

  it("returns true for valid email format", () => {
    expect(isValidFormat("test@example.com", REGEX_EMAIL)).toBe(true);
  });

  it("returns false for invalid email format", () => {
    expect(isValidFormat("invalid-email@", REGEX_EMAIL)).toBe(false);
  });
});

describe("isEnableSubmitButton function", () => {
  it("returns true when all required fields are dirty and there are no errors", () => {
    const requiredFields = ["username", "password"];
    const dirtyFields = ["username", "password"];
    const errors = {};

    const result = isEnableSubmitButton(requiredFields, dirtyFields, errors);
    expect(result).toBe(true);
  });

  it("returns false when not all required fields are dirty", () => {
    const requiredFields = ["username", "password"];
    const dirtyFields = ["username"];
    const errors = {};

    const result = isEnableSubmitButton(requiredFields, dirtyFields, errors);
    expect(result).toBe(false);
  });

  it("returns false when there are errors", () => {
    const requiredFields = ["username", "password"];
    const dirtyFields = ["username", "password"];
    const errors = { username: "Username is not correct format" };

    const result = isEnableSubmitButton(requiredFields, dirtyFields, errors);
    expect(result).toBe(false);
  });

  it("returns true when no required fields are provided", () => {
    const requiredFields: string[] = [];
    const dirtyFields = ["username"];
    const errors = {};

    const result = isEnableSubmitButton(requiredFields, dirtyFields, errors);
    expect(result).toBe(true);
  });

  it("returns false when no dirty fields are provided", () => {
    const requiredFields = ["username"];
    const dirtyFields: string[] = [];
    const errors = {};

    const result = isEnableSubmitButton(requiredFields, dirtyFields, errors);
    expect(result).toBe(false);
  });
});

describe("setServerActionErrors function", () => {
  it("sets server action errors for each field", () => {
    const setErrorMock = jest.fn();

    const fields = {
      username: [
        "Username is required",
        "Username must be alphanumeric",
        "Username not have special syntax",
      ],
      password: ["Password must be at least 8 characters"],
    };

    setServerActionErrors(fields, setErrorMock);

    expect(setErrorMock).toHaveBeenCalledWith("username", {
      message:
        "Username is required\r\nUsername must be alphanumeric\r\nUsername not have special syntax",
    });
    expect(setErrorMock).toHaveBeenCalledWith("password", {
      message: "Password must be at least 8 characters",
    });
    expect(setErrorMock).toHaveBeenCalledTimes(2);
  });

  it("handle empty field", () => {
    const setErrorMock = jest.fn();

    const fields = {};

    setServerActionErrors(fields, setErrorMock);

    expect(setErrorMock).not.toHaveBeenCalled();
  });
});

describe("isEmpty function", () => {
  it("returns true for empty string", () => {
    expect(isEmpty("")).toBe(true);
  });

  it("returns false for non-empty string", () => {
    expect(isEmpty("non-empty")).toBe(false);
  });

  it("returns true for empty array", () => {
    expect(isEmpty([])).toBe(true);
  });

  it("returns false for non-empty array", () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  it("returns true for empty object", () => {
    expect(isEmpty({})).toBe(true);
  });

  it("returns false for non-empty object", () => {
    expect(isEmpty({ priority: "high" })).toBe(false);
  });

  it("returns true for null", () => {
    expect(isEmpty(null)).toBe(true);
  });

  it("returns true for undefined", () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it("returns true for 0", () => {
    expect(isEmpty(0)).toBe(true);
  });
});

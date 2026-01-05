import { generatePasswordRegex } from "@repo/ui/utils/password";

describe("generatePasswordRegex function", () => {
  const passwordRegex = generatePasswordRegex(8);

  it("matches passwords with at least one lowercase letter, one uppercase letter, one digit, and length >= 8", () => {
    expect(passwordRegex.test("ValidPassword123")).toBe(true);
  });

  it("does not match passwords without at least one lowercase letter", () => {
    expect(passwordRegex.test("INVALIDPASSWORD123")).toBe(false);
  });

  it("does not match passwords without at least one uppercase letter", () => {
    expect(passwordRegex.test("invalidpassword123")).toBe(false);
  });

  it("does not match passwords without at least one digit", () => {
    expect(passwordRegex.test("InvalidPassword")).toBe(false);
  });

  it("does not match passwords with length less than required", () => {
    expect(passwordRegex.test("InPas1")).toBe(false);
  });

  it("matches passwords with exactly the required length", () => {
    expect(passwordRegex.test("ValPass1")).toBe(true);
  });

  it("matches passwords with special characters and meets all requirements", () => {
    expect(passwordRegex.test("ValidP@ss1")).toBe(true);
  });
});

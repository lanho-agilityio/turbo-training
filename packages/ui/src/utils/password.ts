/**
 * Generates a regular expression to validate passwords.
 * The password must contain at least one lowercase letter, one uppercase letter, and one digit.
 * The minimum length of the password is specified by the requireLength parameter.
 *
 * @param {number} requireLength - The minimum length required for the password.
 * @returns {RegExp} - The generated regular expression for password validation.
 */

export const generatePasswordRegex = (requireLength: number): RegExp => {
  const pattern = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{${requireLength},}$`;

  const passwordRegex = new RegExp(pattern);
  return passwordRegex;
};

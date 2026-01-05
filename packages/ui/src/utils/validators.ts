import { FieldValues, Path, UseFormSetError } from "react-hook-form";

export const isRequired = (value: string | null | undefined): boolean =>
  !!value;

export const isValidFormat = (value = "", pattern: RegExp): boolean =>
  value == "" || pattern.test(value);

export const isEnableSubmitButton = (
  requiredFields: string[],
  dirtyFields: string[],
  errors: Record<string, unknown>
): boolean => {
  const isMatchAllRequiredFields: boolean = requiredFields.every((field) =>
    dirtyFields.includes(field)
  );

  return isMatchAllRequiredFields && errors && !Object.keys(errors).length;
};

export const setServerActionErrors = <T extends FieldValues>(
  fields: { [key: string]: string[] | string | undefined },
  setError: UseFormSetError<T>
) => {
  return Object.keys(fields).map((field: string) => {
    const errorMessage = Array.isArray(fields[field])
      ? fields[field].join("\r\n")
      : fields[field];
    setError(field as Path<T>, {
      message: fields[field] ? errorMessage : "Error",
    });
  });
};

export const isEmpty = <T>(value: T): boolean => {
  if (value && (typeof value === "string" || Array.isArray(value))) {
    return !value.length;
  }

  if (value && typeof value === "object") {
    return !Object.keys(value).length;
  }

  return true;
};

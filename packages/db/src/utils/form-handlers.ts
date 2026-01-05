import { ERROR_MESSAGES } from "@repo/ui/constants/messages";
import { Effect, ParseResult, Schema } from "effect";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
  ResolverResult,
} from "react-hook-form";

export const effectSchemaResolver = <A extends FieldValues>(
  schema: Schema.Schema<A>
): Resolver<A> => {
  return async (values): Promise<ResolverResult<A>> => {
    try {
      const decodeEffect = ParseResult.decodeUnknownEither(schema, {
        errors: "all",
      })(values);
      const result = await Effect.runPromise(Effect.either(decodeEffect));
      if (result._tag === "Right") {
        return {
          values: result.right,
          errors: {},
        };
      }
      const errors: Record<string, FieldError> = {};
      const parseError = new ParseResult.ParseError({ issue: result.left });
      const formatted = ParseResult.ArrayFormatter.formatErrorSync(parseError);
      formatted.forEach((error) => {
        const path = error.path;
        const fieldName = path.join(".");
        errors[fieldName] = {
          type: "validation",
          message: error.message,
        };
      });
      return {
        values: {},
        errors: errors as FieldErrors<A>,
      } as ResolverResult<A>;
    } catch {
      return {
        values: values as A,
        errors: {},
      };
    }
  };
};

export const effectSafeParse = async <A extends FieldValues>(
  schema: Schema.Schema<A>,
  values: A
): Promise<{
  success: boolean;
  data: A;
  errors: Record<string, string | string[]>;
}> => {
  try {
    const decodeEffect = ParseResult.decodeUnknownEither(schema, {
      errors: "all",
    })(values);
    const result = await Effect.runPromise(Effect.either(decodeEffect));
    if (result._tag === "Right") {
      return {
        success: true,
        data: result.right,
        errors: {},
      };
    }
    const errors: Record<string, string> = {};
    const parseError = new ParseResult.ParseError({ issue: result.left });
    const formatted = ParseResult.ArrayFormatter.formatErrorSync(parseError);
    formatted.forEach((error) => {
      const path = error.path;
      const fieldName = path.join(".");
      errors[fieldName] = error.message;
    });
    return {
      success: false,
      data: values,
      errors: errors,
    };
  } catch {
    return {
      success: false,
      data: values,
      errors: {},
    };
  }
};

export const ERROR_MESSAGE_MAP = {
  UnauthorizedAccess: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
  TaskNotFound: ERROR_MESSAGES.DATA_NOT_FOUND,
  ProjectArchived: ERROR_MESSAGES.PROJECT_IS_ARCHIVED,
  FirestoreError: ERROR_MESSAGES.GENERAL_ERROR,
  DocumentNotFound: ERROR_MESSAGES.DATA_NOT_FOUND,
} as const;

type AppErrorTag = keyof typeof ERROR_MESSAGE_MAP;

export const getErrorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === "object" &&
    "_tag" in error &&
    typeof (error as any)._tag === "string"
  ) {
    const tag = (error as any)._tag as string;

    if (tag in ERROR_MESSAGE_MAP) {
      return ERROR_MESSAGE_MAP[tag as AppErrorTag];
    }
  }

  return ERROR_MESSAGES.GENERAL_ERROR;
};

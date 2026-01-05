import { Data } from "effect";

export type BaseEntity = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isArchived: boolean;
  createdBy: string;
};

export class DocumentNotFound extends Data.TaggedError("DocumentNotFound")<{
  readonly collectionKey: string;
  readonly itemId: string;
}> {}

export class UnauthorizedAccess extends Data.TaggedError(
  "UnauthorizedAccess"
) {}

export class ProjectNotFound extends Data.TaggedError("ProjectNotFound") {}

export class ProjectArchived extends Data.TaggedError("ProjectArchived") {}

export class UpsertingError extends Data.TaggedError("UpsertingError") {}

export class TaskNotFound extends Data.TaggedError("TaskNotFound") {}

export class DeleteProjectError extends Data.TaggedError("DeleteProjectError")<{
  readonly cause: unknown;
}> {}

export class EmailExists extends Data.TaggedError("EmailExists") {}

export class FirestoreError extends Data.TaggedError("FirestoreError")<{
  readonly cause: unknown;
}> {}

export interface PaginatedResult<T> {
  success: true;
  data: T[];
  total: number;
}

export interface SingleResult<T> {
  success: true;
  data: T | null;
  error: undefined;
}

export interface SuccessVoid {
  success: true;
  data: void;
}

export interface Failure {
  success: false;
  data: null;
  error: string;
}

import { FieldPath, OrderByDirection, WhereFilterOp } from "firebase/firestore";

// constants
import { ORDER_TYPES } from "@repo/ui/constants/queryParams";

export type QueryFilter = {
  field: string | FieldPath;
  comparison: WhereFilterOp;
  value: string | string[] | boolean;
};

export type QueryParam = {
  orderItem?: { field: string; type: OrderByDirection };
  query?: QueryFilter[];
  limitItem?: number;
  page?: number;
};

export interface SearchParams {
  page?: string;
  sortBy?: ORDER_TYPES;
}

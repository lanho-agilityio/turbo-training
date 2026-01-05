import { isEmpty } from './validators';

export type QueryParam = Record<string, string | boolean | number | undefined>;

export const getQueryParams = (queryParam: QueryParam): string => {
  const removeEmptyValues = Object.fromEntries(
    Object.entries(queryParam).filter(([_, value]) => value),
  ) as { [k: string]: string };
  if (isEmpty(removeEmptyValues)) {
    return '';
  } else {
    return `?${new URLSearchParams(removeEmptyValues).toString()}`;
  }
};

export const getSearchParams = <T>(searchParams: URLSearchParams): T => {
  const entries = searchParams && Array.from(searchParams.entries());
  const queryParams: T =
    entries &&
    entries.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as T);

  return queryParams;
};

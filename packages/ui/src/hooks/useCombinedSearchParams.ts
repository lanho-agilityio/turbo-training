import { useSearchParams } from "next/navigation";

// Utils
import { getQueryParams, QueryParam } from "@repo/ui/utils/queryParams";

type QueryParams = {
  [key: string]: string;
};

export const useCombinedSearchParams = () => {
  const searchParams = useSearchParams();
  const queryParamsObject: QueryParams = {};

  searchParams.forEach((value: string, key: string) => {
    queryParamsObject[key] = value;
  });

  // Function to update query parameters
  const setQueryParams = (queryParam: QueryParam) => {
    const updatedQuery = getQueryParams({
      ...queryParamsObject,
      ...queryParam,
    });

    return updatedQuery;
  };

  return {
    setQueryParams,
  };
};

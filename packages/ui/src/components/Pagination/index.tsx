"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useMemo, useTransition } from "react";

// Hooks
import { useCombinedSearchParams } from "@repo/ui/hooks/useCombinedSearchParams";

// Icons
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

// Components
import { Button } from "@repo/ui/components/Button";

// Utils
import { getNumRange } from "@repo/ui/utils/numbers";
import { cn } from "@repo/ui/utils/styles";

// Constants
import { SEARCH_PARAMS } from "@repo/ui/constants/queryParams";

interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  siblingCount?: number;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: "primary" | "outline";
  customClass?: {
    wrapper?: string;
    button?: string;
  };
  onChangePageNumber: (value: number) => void;
}

const LEFT_DOTS = "left-dots";
const RIGHT_DOTS = "right-dots";

export const Pagination = ({
  total,
  currentPage,
  pageSize,
  siblingCount = 2,
  startIcon = <FaChevronLeft />,
  endIcon = <FaChevronRight />,
  variant = "outline",
  customClass,
  onChangePageNumber,
}: PaginationProps) => {
  const buttonBaseClass = "text-black rounded-lg flex justify-center";

  const totalPageCount = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
  );

  const firstPageIndex = 1;
  const secondPageIndex = 2;
  const lastPageIndex = totalPageCount;
  const secondLastPageIndex = totalPageCount - 1;
  const isShowLastPage = firstPageIndex !== lastPageIndex;

  const paginationRange = useMemo(() => {
    const startIndex = Math.max(currentPage - siblingCount, secondPageIndex);
    const endIndex = Math.min(currentPage + siblingCount, secondLastPageIndex);
    const middleRange: Array<number | string> = getNumRange(
      startIndex,
      endIndex
    );
    if (currentPage - siblingCount > secondPageIndex) {
      middleRange.unshift(LEFT_DOTS);
    }
    if (currentPage + siblingCount < secondLastPageIndex) {
      middleRange.push(RIGHT_DOTS);
    }
    return middleRange;
  }, [secondPageIndex, secondLastPageIndex, siblingCount, currentPage]);

  const hasPrevious = useMemo(() => currentPage > 1, [currentPage]);
  const hasNext = useMemo(
    () => currentPage * pageSize < total,
    [currentPage, pageSize, total]
  );

  const handleClickNext = useCallback(() => {
    onChangePageNumber(currentPage + 1);
  }, [onChangePageNumber, currentPage]);

  const handleClickPrevious = useCallback(() => {
    onChangePageNumber(currentPage - 1);
  }, [onChangePageNumber, currentPage]);

  const handleChangePage = useCallback(
    (pageNumber: number) => {
      onChangePageNumber(pageNumber);
    },
    [onChangePageNumber]
  );

  if (total === 0 || currentPage <= 0) {
    return null;
  }

  return (
    <div
      className={cn("flex flex-row items-center gap-3", customClass?.wrapper)}
    >
      <Button
        variant={variant}
        customClass={cn(
          buttonBaseClass,
          "px-3",
          variant === "primary" && "text-white",
          customClass?.button,
          {
            "bg-zinc-100 dark:bg-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-white opacity-80":
              !hasPrevious,
          }
        )}
        onClick={handleClickPrevious}
        disabled={!hasPrevious}
        startIcon={startIcon}
        customIconClass="mr-1"
      >
        Previous
      </Button>

      <Button
        customClass={cn(
          buttonBaseClass,
          "w-10 h-10 hidden md:block",
          variant === "primary" && "text-white",
          currentPage === firstPageIndex && "bg-zinc-300",
          customClass?.button
        )}
        variant={variant}
        onClick={() => handleChangePage(firstPageIndex)}
      >
        {firstPageIndex}
      </Button>
      {paginationRange.map((page) => {
        if (typeof page === "string" && page.includes("dots")) {
          return (
            <span
              className="hidden md:block dark:text-white"
              key={`page-number-${page}`}
            >
              &#8230;
            </span>
          );
        }
        return (
          <Button
            customClass={cn(
              buttonBaseClass,
              "w-10 h-10 hidden md:block",
              variant === "primary" && "text-white",
              currentPage === Number(page) && "bg-zinc-300",
              customClass?.button
            )}
            variant={variant}
            key={`page-number-${page}`}
            onClick={() => handleChangePage(Number(page))}
          >
            {page}
          </Button>
        );
      })}
      {isShowLastPage && (
        <Button
          customClass={cn(
            buttonBaseClass,
            "w-10 h-10 hidden md:block",
            variant === "primary" && "text-white",
            currentPage === lastPageIndex && "bg-zinc-300",
            customClass?.button
          )}
          variant={variant}
          onClick={() => handleChangePage(lastPageIndex)}
        >
          {lastPageIndex}
        </Button>
      )}

      <Button
        variant={variant}
        customClass={cn(
          buttonBaseClass,
          "px-3",
          variant === "primary" && "text-white",
          customClass?.button,
          {
            "bg-zinc-100 dark:bg-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-white opacity-80":
              !hasNext,
          }
        )}
        onClick={handleClickNext}
        disabled={!hasNext}
        endIcon={endIcon}
        customIconClass="ml-1"
      >
        Next
      </Button>
    </div>
  );
};

export const PaginationWrapper = ({
  total,
  pageSize,
}: Pick<PaginationProps, "total" | "pageSize">) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [, startTransition] = useTransition();
  const { setQueryParams } = useCombinedSearchParams();

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      params.set(SEARCH_PARAMS.PAGE, page.toString());

      const combinedQueryParams = setQueryParams({ page });

      startTransition(() => {
        router.push(combinedQueryParams);
      });
    },
    [params, router, setQueryParams]
  );

  return (
    <Pagination
      total={total}
      currentPage={parseInt(params.get(SEARCH_PARAMS.PAGE) ?? "1")}
      pageSize={pageSize}
      onChangePageNumber={handlePageChange}
    />
  );
};

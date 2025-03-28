import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";

export const generatePaginationLinks = (
  currentPage: number,
  totalPages: number
) => {
  const [, setSearchParams] = useSearchParams();
  const pages: JSX.Element[] = [];

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      return prev;
    });
  };

  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  } else {
    for (let i = 1; i <= 2; i++) {
      pages.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    if (2 < currentPage && currentPage < totalPages - 1) {
      pages.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
      pages.push(
        <PaginationItem key={`page-${currentPage}`}>
          <PaginationLink
            onClick={() => handlePageChange(currentPage)}
            isActive={true}
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
      );
    }
    pages.push(
      <PaginationItem key="ellipsis-end">
        <PaginationEllipsis />
      </PaginationItem>
    );
    for (let i = totalPages - 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  }
  return pages;
};

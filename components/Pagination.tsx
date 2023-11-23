// PaginationComponent.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const pageNumbers = [];
  const maxPageNumberVisible = 5; // par exemple

  for (let i = 1; i <= totalPages; i++) {
    // Si le nombre total de pages est grand, montrez des ellipses et réduisez le nombre de pages visibles
    if (totalPages > maxPageNumberVisible) {
      if (i === currentPage || i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        pageNumbers.push(i);
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pageNumbers.push('...');
      }
    } else {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="flex justify-center items-center my-4 ">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="mx-1 px-3 py-1 rounded hover:bg-gray-600"
        >
          Prev
        </button>
      )}
      {/* Pagination Numbers */}
      {pageNumbers.map((number, index) =>
        number === '...' ? (
          <span key={index} className="mx-1">...</span>
        ) : (
          <button
            key={number}
            className={`mx-1 px-3 py-1 rounded ${number === currentPage ? 'bg-green-800 text-white' : ' hover:bg-gray-600'}`}
            onClick={() => onPageChange(number as number)}
          >
            {number}
          </button>
        )
      )}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="mx-1 px-3 py-1 rounded  hover:bg-gray-600"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default PaginationComponent;

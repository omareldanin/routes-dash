import React from "react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center items-center mt-10 gap-2">
      {/* السابق */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 border bg-black text-white rounded disabled:opacity-50">
        السابق
      </button>

      {/* الصفحات */}
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 border rounded ${
            page === i + 1
              ? "bg-black text-white"
              : "text-gray-400 hover:bg-gray-100"
          }`}>
          {i + 1}
        </button>
      ))}

      {/* التالي */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 border rounded bg-black text-white disabled:opacity-50">
        التالي
      </button>
    </div>
  );
};

export default Pagination;

type Props = {
  page: number;
  changePage: (page: number) => void;
  hasMore?: boolean;
  totalPages?: number;
};

const Pagination = ({ page, changePage, hasMore, totalPages }: Props) => {
  if (totalPages === 0) return null;
  return (
    <nav aria-label="Page navigation">
      <ul className="flex items-center -space-x-px h-8 text-sm justify-center md:justify-start">
        <li>
          <button
            onClick={() => page > 1 && changePage(Math.max(page - 1, 0))}
            disabled={page === 1}
            className="disabled:text-gray-300 flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </button>
        </li>
        <li>
          <span className="cursor-default flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            {page > 0 ? `${page} / ${totalPages}` : `1 / ${totalPages}`}
          </span>
        </li>
        <li>
          <button
            onClick={() => changePage(hasMore ? page + 1 : page)}
            disabled={/* isPreviousData ||  */ !hasMore}
            className="disabled:text-gray-300 flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

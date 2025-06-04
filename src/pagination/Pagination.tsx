type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ totalPages, currentPage, onPageChange }: Props) => {
  if (totalPages <= 0) {
    return null; // No items to paginate
  }

  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderNumbers = () => {
    const numbers = Array.from({ length: totalPages }, (_, i) => i + 1).map(
      (number) => (
        <button
          key={number}
          className={`px-3 py-1 border rounded hover:bg-gray-200 ${
            number === currentPage ? "bg-gray-300" : ""
          }`}
          disabled={number === currentPage}
          onClick={() => handleClick(number)}
        >
          {number}
        </button>
      )
    );
    return numbers;
  };
  return (
    <div className="flex justify-center items-center space-x-2 mt-4 pb-4 text-white">
      <button
        className={`px-3 py-1 border rounded hover:bg-gray-400 ${
          currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : ""
        }`}
        disabled={currentPage === 1}
        onClick={() => handleClick(currentPage - 1)}
      >
        previous
      </button>
      {renderNumbers()}
      <button
        className={`px-3 py-1 border rounded hover:bg-gray-400 ${
          currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : ""
        }`}
        disabled={currentPage === totalPages}
        onClick={() => handleClick(currentPage + 1)}
      >
        next
      </button>
    </div>
  );
};

export default Pagination;

import { useState } from "react";
import Pagination from "./Pagination";

const data = Array.from({ length: 50 }, (_, i) => i + 1);

const PaginatedPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <div>
      {currentItems.map((item) => (
        <div className="flex justify-center items-center" key={item}>
          <li className=" p-2 bg-white rounded shadow mb-2">Item {item}</li>
        </div>
      ))}
      {/* Pagination Component */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PaginatedPage;

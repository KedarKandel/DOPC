// Components

import CalculateForm from "./components/CalculatorForm";
import PaginatedPage from "./pagination/PaginatedPage";

const App: React.FC = () => {
  return (
    <div className=" min-h-screen bg-gradient-to-r from-gray-600 to-gray-700">
      <h1 className="text-3xl font-extrabold text-white p-2">Farmerly</h1>
      <CalculateForm />
      <PaginatedPage/>
    </div>
  );
};

export default App;

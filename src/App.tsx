// Components
import CalculateForm from "./components/CalculateForm";

const App: React.FC = () => {
  return (
    <div className=" min-h-screen bg-gradient-to-r from-sky-400 to-sky-500">
      <h1 className="text-3xl font-extrabold text-white p-2">Wolt</h1>
      <CalculateForm />
    </div>
  );
};

export default App;

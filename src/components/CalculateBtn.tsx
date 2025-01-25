type Props = {
  isSubmitting: boolean;
};

const CalculateBtn = ({ isSubmitting }: Props) => {
  return (
    <button
      role="button"
      type="submit"
      aria-label="calculate delivery price breakdown"
      className={`mb-4 max-w-max bg-green-600 py-2 px-4 rounded hover:bg-green-500 ${
        isSubmitting ? "text-gray-300 cursor-not-allowed" : "text-white"
      }`}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Calculating..." : "Calculate delivery price"}
    </button>
  );
};

export default CalculateBtn;

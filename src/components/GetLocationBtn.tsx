type Props = {
  handleGetLocation: () => void;
  isLocationFetching: boolean;
};

const GetLocationBtn = ({ handleGetLocation, isLocationFetching }: Props) => {
  return (
    <button
      type="button"
      role="button"
      onClick={handleGetLocation}
      aria-label="get user location co-ordinates"
      className={`mb-4 max-w-max bg-blue-500 py-2 px-4 rounded  ${
        isLocationFetching
          ? "text-gray-600 bg-gray-400 cursor-not-allowed"
          : "text-white hover:bg-blue-600"
      }`}
      disabled={isLocationFetching}
    >
      {isLocationFetching ? "Loading..." : "Get Location"}
    </button>
  );
};

export default GetLocationBtn;

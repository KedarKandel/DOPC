type Props = {
  getLocation: () => void;
  isLocationFetching: boolean;
  error: string |null;
};

const GetLocationBtn = ({ getLocation, isLocationFetching, error }: Props) => {
  return (
    <div>
       {error && <p className="my-1 text-red-500">{error}</p>}
      <button
        type="button"
        aria-label="Get current location and populate latitude and longitude"
        onClick={getLocation}
        className={`mb-4 max-w-max bg-blue-500 py-2 px-4 rounded hover:bg-blue-600 ${
          isLocationFetching ? "text-gray-300" : "text-white"
        }`}
        disabled={isLocationFetching}
      >
        {isLocationFetching ? "Getting location..." : "Get Location"}
      </button>
     
    </div>
  );
};

export default GetLocationBtn;

type Props = {
  getLocation: () => void;
  isLocationFetching: boolean;
};

const GetLocationBtn = ({ getLocation, isLocationFetching }: Props) => {
  return (
    <button
      aria-label="getLocationbutton"
      onClick={getLocation}
      className={`mb-4 max-w-max bg-blue-500 py-2 px-4 rounded hover:bg-blue-600 ${
        isLocationFetching ? "text-gray-300 cursor-not-allowed" : "text-white"
      }`}
      disabled={isLocationFetching}
    >
      {isLocationFetching ? "Getting location..." : "Get Location"}
    </button>
  );
};

export default GetLocationBtn;

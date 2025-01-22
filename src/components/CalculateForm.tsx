// libraries
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// types and utilities
import { FormData, schema } from "../utils/schema";
import { PriceBreakDownType } from "../utils/types";
import { calculatePriceBreakDown, getUserLocation } from "../utils/utils";

// components
import FormInput from "./FormInput";
import CalculateBtn from "./CalculateBtn";
import GetLocationBtn from "./GetLocationBtn";
import PriceBreakdownDisplay from "./PriceBreakDown";

const CalculateForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      venueSlug: "home-assignment-venue-helsinki",
      cartValue: "",
      userLatitude: "",
      userLongitude: "",
    },
    resolver: zodResolver(schema),
  });

  // get location state
  const [isLocationFetching, setIsLocationFetching] = useState(false);

  // global states
  const [priceBreakdown, setPriceBreakdown] =
    useState<PriceBreakDownType | null>(null);
  const [globalErrors, setGlobalErrors] = useState<string | null>(null);

  // states -- to stop resubmitting same data.
  const [lastSubmittedData, setLastSubmittedData] = useState<FormData | null>(
    null
  );

  // get the user location
  const handleGetLocation = async () => {
    setGlobalErrors(null);
    setIsLocationFetching(true);
    clearErrors("userLatitude");
    clearErrors("userLongitude");
    try {
      const location = await getUserLocation();
      setValue("userLatitude", location.userLatitude);
      setValue("userLongitude", location.userLongitude);
    } catch (err) {
      setGlobalErrors(`Error fetching location: ${err}`);
    } finally {
      setIsLocationFetching(false);
    }
  };

  // Handle input changes -- add leading zero if input starts with "."
  const handleChange = (
    fieldName: keyof FormData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    // Clear errors for the field and global errors
    clearErrors(fieldName);
    setGlobalErrors(null);

    if (fieldName === "cartValue") {
      const formattedValue = value.startsWith(".") ? `0${value}` : value;
      setValue("cartValue", formattedValue);
    } else {
      setValue(fieldName, value);
    }
    // Trigger validation for empty fields again.
    trigger(fieldName);
  };

  // submit the form and calculate price breakdown
  const onFormSubmit = async (data: FormData) => {
    // Stop resubmitting if the data has not changed.
    if (
      lastSubmittedData &&
      JSON.stringify(data) === JSON.stringify(lastSubmittedData)
    ) {
      setGlobalErrors(
        `Update form values to calculate new price breakdown.`
      );
      return;
    }
    setLastSubmittedData(data);
    try {
      const result = await calculatePriceBreakDown(
        data.venueSlug,
        parseFloat(data.cartValue)
      );
      if (result.error) {
        setGlobalErrors(result.error);
        setPriceBreakdown(null);
      } else {
        setPriceBreakdown(result);
        setGlobalErrors(null);
      }
    } catch (error) {
      setGlobalErrors(
        `An error occurred while calculating the price breakdown: ${error}`
      );
      setPriceBreakdown(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="w-full bg-[#fff] max-w-md mx-auto flex flex-col space-y-4 py-2 px-4 border-2 border-gray-300 rounded-lg shadow-lg"
    >
      <h1 className="mb-2 text-2xl text-blue-500 font-bold p-1 border-b border-blue-400 shadow-sm">
        Delivery Order Price Calculator
      </h1>
      <FormInput
        name="venueSlug"
        label="Venue Slug"
        dataTestId="venueSlug"
        type="text"
        placeholder="Venue name"
        register={register("venueSlug")}
        error={errors.venueSlug}
        onChange={(e) => handleChange("venueSlug", e)}
      />
      <FormInput
        name="cartValue"
        label="Cart Value (EUR)"
        dataTestId="cartValue"
        type="string"
        placeholder="0.00"
        register={register("cartValue")}
        error={errors.cartValue}
        onChange={(e) => handleChange("cartValue", e)}
      />
      <FormInput
        name="userLatitude"
        label="User Latitude"
        dataTestId="userLatitude"
        type="text"
        placeholder="User location latitude"
        register={register("userLatitude")}
        error={errors.userLatitude}
        readOnly
        required
      />
      <FormInput
        name="userLongitude"
        label="User Longitude"
        dataTestId="userLongitude"
        type="text"
        placeholder="User location longitude"
        register={register("userLongitude")}
        error={errors.userLongitude}
        readOnly
        required
      />
      {globalErrors && (
        <p className="my-1 text-sm text-red-500">{globalErrors}</p>
      )}
      <GetLocationBtn
        getLocation={handleGetLocation}
        isLocationFetching={isLocationFetching}
      />
      <CalculateBtn isSubmitting={isSubmitting} />
      <PriceBreakdownDisplay priceBreakdown={priceBreakdown} />
    </form>
  );
};

export default CalculateForm;

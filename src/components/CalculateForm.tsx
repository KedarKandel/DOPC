import {
  UseFormRegister,
  UseFormSetValue,
  UseFormHandleSubmit,
  FieldErrors,
  UseFormClearErrors,
  SubmitHandler,
  UseFormTrigger,
} from "react-hook-form";
import { FormData, PriceBreakDownType } from "../utils/schema";
import FormInput from "./FormInput";
import CalculateBtn from "./CalculateBtn";
import GetLocationBtn from "./GetLocationBtn";
import { getUserLocation } from "../utils/utils";
import { useState } from "react";
import PriceBreakdownDisplay from "./PriceBreakDown";

type CalculateFormProps = {
  register: UseFormRegister<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
  setValue: UseFormSetValue<FormData>;
  formErrors: FieldErrors<FormData>;
  clearFormErrors: UseFormClearErrors<FormData>;
  globalErrors: string | null;
  setGlobalErrors: React.Dispatch<React.SetStateAction<string | null>>;
  isSubmitting: boolean;
  onFormSubmit: SubmitHandler<FormData>;
  trigger: UseFormTrigger<FormData>;
  priceBreakdown: PriceBreakDownType | null
};

const CalculateForm = ({
  register,
  handleSubmit,
  setValue,
  formErrors,
  clearFormErrors,
  trigger,
  globalErrors,
  setGlobalErrors,
  isSubmitting,
  onFormSubmit,
  priceBreakdown
}: CalculateFormProps) => {
  // get location state
  const [isLocationFetching, setIsLocationFetching] = useState(false);

  // get the user location
  const handleGetLocation = async () => {
    setGlobalErrors(null);
    setIsLocationFetching(true);
    clearFormErrors("userLatitude");
    clearFormErrors("userLongitude");
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

  // Handle input changes for proper formatting of cart value
  //  => add leading zero if input starts with "."
  const handleChange = (
    fieldName: keyof FormData,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    // Clear errors for the field
    clearFormErrors(fieldName);

    if (fieldName === "cartValue") {
      const formattedValue = value.startsWith(".") ? `0${value}` : value;
      setValue("cartValue", formattedValue);
    } else {
      setValue(fieldName, value);
    }
    // Trigger validation for empty fields again.
    trigger(fieldName);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="w-full bg-[#fff] max-w-md mx-auto flex flex-col space-y-4 p-4 border-2 border-gray-300 rounded-lg shadow-lg"
    >
      
      <h1 className="mb-2 text-2xl text-blue-500 font-bold">
        Delivery Order Price Calculator
      </h1>
      <FormInput
        name="venueSlug"
        label="Venue Slug"
        dataTestId="venueSlug"
        type="text"
        placeholder="Venue name"
        register={register("venueSlug")}
        error={formErrors.venueSlug}
        onChange={(e) => handleChange("venueSlug", e)}
      />
      <FormInput
        name="cartValue"
        label="Cart Value (EUR)"
        dataTestId="cartValue"
        type="string"
        placeholder="0.00"
        register={register("cartValue")}
        error={formErrors.cartValue}
        onChange={(e) => handleChange("cartValue", e)}
      />
      <FormInput
        name="userLatitude"
        label="User Latitude"
        dataTestId="userLatitude"
        type="text"
        placeholder="User location latitude"
        register={register("userLatitude")}
        error={formErrors.userLatitude}
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
        error={formErrors.userLongitude}
        readOnly
        required
      />
      {globalErrors && <p className="my-1 text-red-500">{globalErrors}</p> }
      <GetLocationBtn
        getLocation={handleGetLocation}
        isLocationFetching={isLocationFetching}
      />
      <CalculateBtn isSubmitting={isSubmitting}/>
      <PriceBreakdownDisplay priceBreakdown={priceBreakdown}/>
    </form>
  );
};

export default CalculateForm;

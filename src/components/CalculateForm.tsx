import {
  UseFormRegister,
  UseFormSetValue,
  UseFormHandleSubmit,
  FieldErrors,
  UseFormClearErrors,
  SubmitHandler,
} from "react-hook-form";
import { FormData } from "../utils/schema";
import FormInput from "./FormInput";
import CalculateBtn from "./CalculateBtn";
import GetLocationBtn from "./GetLocationBtn";
import { getUserLocation } from "../utils/utils";
import { useState } from "react";

type CalculateFormProps = {
  register: UseFormRegister<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
  setValue: UseFormSetValue<FormData>;
  formErrors: FieldErrors<FormData>;
  clearFormErrors: UseFormClearErrors<FormData>;
  globalErrors: string | null;
  setGlobalErrors: React.Dispatch<React.SetStateAction<string | null>>;
  isSubmitting: boolean
  onFormSubmit: SubmitHandler<FormData>
};

const CalculateForm = ({
  register,
  handleSubmit,
  setValue,
  formErrors,
  clearFormErrors,
  globalErrors,
  setGlobalErrors,
  isSubmitting,
  onFormSubmit
}: CalculateFormProps) => {
  // get location state
  const [isLocationFetching, setIsLocationFetching] = useState(false);

  // get the user location
  const handleGetLocation = async () => {
    setGlobalErrors("");
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

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="max-w-sm mx-auto flex flex-col space-y-2 p-3 mt-8"
    >
      <h1 className="mb-2 text-2xl text-blue-500 font-bold">
        Delivery Order Price Calculator
      </h1>
      <FormInput
        name="venueSlug"
        label="Venue Slug"
        type="text"
        placeholder="Venue name"
        register={register("venueSlug")}
        error={formErrors.venueSlug}
      />
      <FormInput
        name="cartValue"
        label="Cart Value (EUR)"
        dataTestId="cartValue"
        type="string"
        placeholder="0.00"
        register={register("cartValue")}
        error={formErrors.cartValue}
        required
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
      <GetLocationBtn
        getLocation={handleGetLocation}
        isLocationFetching={isLocationFetching}
        error={globalErrors}
      />
      <CalculateBtn isSubmitting={isSubmitting} />
    </form>
  );
};

export default CalculateForm;

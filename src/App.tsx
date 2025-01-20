import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PriceBreakdown, schema } from "./utils/schema";
import { FormData } from "./utils/schema";
import CalculateForm from "./components/CalculateForm";
import { useState } from "react";
import { calculatePriceBreakDown } from "./utils/utils";

function App() {
  // global states
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(
    null
  );
  const [globalErrors, setGlobalErrors] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      venueSlug: "",
      cartValue: "",
      userLatitude: "",
      userLongitude: "",
    },
    resolver: zodResolver(schema),
  });

  //
  const onSubmit = async (data: FormData) => {
    try {
      const result = await calculatePriceBreakDown(
        data.venueSlug,
        parseFloat(data.cartValue)
      );

      if (result.error) {
        setGlobalErrors(result.error);
        setPriceBreakdown(null); // Clear the price breakdown
      } else {
        setPriceBreakdown(result); // Set the price breakdown if no error
      }
    } catch (error) {
      setGlobalErrors(
        "An error occurred while calculating the price breakdown."
      );
      setPriceBreakdown(null); // Clear the price breakdown in case of error
    }
    console.log(priceBreakdown)
  };

  return (
    <CalculateForm
      setValue={setValue}
      formErrors={errors}
      clearFormErrors={clearErrors}
      trigger={trigger}
      register={register}
      handleSubmit={handleSubmit}
      globalErrors={globalErrors}
      setGlobalErrors={setGlobalErrors}
      onFormSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
}

export default App;

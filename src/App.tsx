import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PriceBreakdown, schema } from "./utils/schema";
import { FormData } from "./utils/schema";
import CalculateForm from "./components/CalculateForm";
import { useState } from "react";
import { calculatePriceBreakDown } from "./utils/utils";

import PriceBreakdownDisplay from "./components/PriceBreakDown";

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
        // display cart value and distance without other fees
        setPriceBreakdown(result);
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
    <>
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
      <PriceBreakdownDisplay priceBreakdown={priceBreakdown} />
    </>
  );
}

export default App;

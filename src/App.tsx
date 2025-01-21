// Libraries
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Types and utilities
import { schema } from "./utils/schema";
import { FormData } from "./utils/schema";
import { PriceBreakDownType } from "./utils/types";
import { calculatePriceBreakDown } from "./utils/utils";

// Components
import CalculateForm from "./components/CalculateForm";

function App() {
  // global states
  const [priceBreakdown, setPriceBreakdown] =
    useState<PriceBreakDownType | null>(null);
  const [globalErrors, setGlobalErrors] = useState<string | null>(null);

  // states -- to stop resubmitting same data.
  const [lastSubmittedData, setLastSubmittedData] = useState<FormData | null>(
    null
  );

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

  // submit the form and calculate price breakdown
  const onFormSubmit = async (data: FormData) => {
    // Stop resubmitting if the data has not changed.
    if (
      lastSubmittedData &&
      JSON.stringify(data) === JSON.stringify(lastSubmittedData)
    ) {
      setGlobalErrors(
        "Same entries as earlier. Price breakdown will be same as belows."
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
    <div className=" min-h-screen bg-gradient-to-r from-sky-400 to-sky-500">
      <h1 className="text-3xl font-extrabold text-white p-2">Wolt</h1>
      <CalculateForm
        setValue={setValue}
        formErrors={errors}
        clearFormErrors={clearErrors}
        trigger={trigger}
        register={register}
        handleSubmit={handleSubmit}
        globalErrors={globalErrors}
        setGlobalErrors={setGlobalErrors}
        onFormSubmit={onFormSubmit}
        isSubmitting={isSubmitting}
        priceBreakdown={priceBreakdown}
      />
    </div>
  );
}

export default App;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PriceBreakDownType, schema } from "./utils/schema";
import { FormData } from "./utils/schema";
import CalculateForm from "./components/CalculateForm";
import { useState } from "react";
import { calculatePriceBreakDown } from "./utils/utils";

function App() {
  // global states
  const [priceBreakdown, setPriceBreakdown] =
    useState<PriceBreakDownType | null>(null);
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
      venueSlug: "home-assignment-venue-helsinki",
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
    <div className=" min-h-screen bg-gradient-to-r from-sky-400 to-sky-500">
      <h1 className="text-2xl font-extrabold text-white p-2">Wolt</h1>
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
        priceBreakdown={priceBreakdown}
      />
    </div>
  );
}

export default App;

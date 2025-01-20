import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./utils/schema";
import { FormData } from "./utils/schema";
import CalculateForm from "./components/CalculateForm";
import { useEffect, useState } from "react";
import { fetchVenueLocation } from "./utils/utils";


function App() {

 // global states
  const [globalErrors, setGlobalErrors] = useState<string |null>(null);
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors,isSubmitting},
  } = useForm<FormData>({
    defaultValues: {
      venueSlug: "home-assignment-venue-helsinki",
      cartValue: "",
      userLatitude: "",
      userLongitude: "",
    },
    resolver: zodResolver(schema),
  });

  // venue name
  const venueSlug = watch("venueSlug");

  const onSubmit = async (data:FormData) => {
    setGlobalErrors(null)
    try {
      setIsLoading(true)
      console.log(isSubmitting)
      const venueLocation = await fetchVenueLocation(venueSlug)
      const {venueLatitude, venueLongitude} = venueLocation
      console.log(venueLatitude, venueLongitude)
      console.log(isSubmitting)
      return {venueLatitude, venueLongitude}
    } catch (error) {
      setGlobalErrors("Venue details not found")
      setIsLoading(false)
    }
  };

  

  return (
    <CalculateForm
      setValue={setValue}
      formErrors={errors}
      clearFormErrors={clearErrors}
      register={register}
      handleSubmit={handleSubmit}
      globalErrors= {globalErrors}
      setGlobalErrors = {setGlobalErrors}
      onFormSubmit = {onSubmit}
      isSubmitting= {isSubmitting}
    />
  );
}

export default App;

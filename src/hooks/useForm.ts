import { useState } from "react";


interface FormValue {
  id: string;
  name: string;
  email: string;
  age: number;
  isMarried: boolean;
}
export const useForm = (initialValues: FormValue) => {
  const [values, setValues] = useState<FormValue>(initialValues);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return { values, setValues, handleChange, resetForm };
};

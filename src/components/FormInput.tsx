import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  label: string;
  dataTestId?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormInput = ({
  label,
  dataTestId,
  register,
  error,
  onChange,
  ...props
}: FormInputProps) => {

  // handle typing a decimal number.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // If the input starts with a decimal point, add a leading zero
    if (value.startsWith(".")) {
      value = "0" + value;
    }
    e.target.value = value;
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700" htmlFor={props.name}>
        {label}
      </label>
      <input
        className={`border rounded w-full py-2 px-3 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        id={props.name}
        type={props.type}
        placeholder={props.placeholder}
        data-test-id={dataTestId}
        {...register}
        {...props}
        onChange={handleChange}
      />
      {error && <p className="text-red-700 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;

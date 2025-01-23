import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  label: string;
  dataTestId?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  setGlobalErrors?: React.Dispatch<React.SetStateAction<string | null>>;
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormInput = ({
  label,
  dataTestId,
  register,
  error,
  setGlobalErrors,
  ...props
}: FormInputProps) => {
 
  return (
    <div className="mb-4 w-4/5">
      <label className="block text-lg text-gray-700" htmlFor={props.name}>
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
        onChange={(e) => {
          if (setGlobalErrors) {
            setGlobalErrors(null);
          }
          register.onChange(e);
        }}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;

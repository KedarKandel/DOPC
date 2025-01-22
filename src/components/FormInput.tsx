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
          if (onChange) onChange(e);
        }}
      />
      {error && <p className="text-red-700 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;

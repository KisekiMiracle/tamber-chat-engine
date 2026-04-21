import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  type?: React.HTMLInputTypeAttribute;
  leadingIcon?: React.ReactElement;
  trailingIcon?: React.ReactElement;
  label: string;
  placeholder?: string;
}

export default function FormInput({
  register,
  errors,
  leadingIcon,
  trailingIcon,
  type = "text",
  label,
  placeholder,
}: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => setShowPassword(!showPassword);

  // Determine the actual type to pass to the <input>
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold">
        {String(label)
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/^./, (str) => str.toUpperCase())}
      </span>

      <label className="input w-full">
        {leadingIcon}

        <input
          type={inputType}
          {...register(label)}
          placeholder={placeholder}
          className="focus:outline-none"
        />

        {type === "password" ? (
          <button
            type="button"
            onClick={togglePassword}
            className="flex items-center"
          >
            <Icon
              icon={showPassword ? "mdi:eye-outline" : "mdi:eye-off-outline"}
              className="label"
              width="21"
              height="21"
            />
          </button>
        ) : (
          trailingIcon
        )}
      </label>

      {errors[label] && (
        <span className="text-sm text-rose-600">
          {/* @ts-expect-error */}
          {errors[label].message}
        </span>
      )}
    </div>
  );
}

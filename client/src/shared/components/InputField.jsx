import React, { useId, forwardRef } from "react";

const InputField = forwardRef(
  (
    {
      label,
      type = "text",
      className = "",
      ...props // will receive {...register()} from RHF
    },
    ref
  ) => {
    const id = useId();

    return (
      <div>
        {label && (
          <label htmlFor={id} className="block mb-1 font-medium pl-1">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          type={type}
          className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border w-full border-gray-300 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

export default InputField;

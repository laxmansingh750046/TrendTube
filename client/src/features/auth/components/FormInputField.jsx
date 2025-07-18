import React, { useState, useEffect, useId } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const InputField = ({
  label,
  inputRef,
  type = "text",
  validate = () => [],
  successCheck = () => false,
  className = "",
  ...props
}) => {
  const id = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const validationResult = validate(value);
    setError(validationResult);
    setSuccess(validationResult.length === 0 && successCheck(value));
  }, [value, validate, successCheck]);

  const borderColor = error.length
    ? "border-red-500"
    : success
    ? "border-green-500"
    : "border-gray-300";

  // Determine input type based on password toggle
  const inputType = type === "password" 
    ? (showPassword ? "text" : "password") 
    : type;

  return (
    <div className="w-full relative">
      {label && (
        <label htmlFor={id} className="block mb-1 font-medium pl-1 text-white">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          type={inputType}
          value={value}
          className={`px-3 py-2 rounded-lg bg-gray-950 text-white outline-none focus:bg-gray-600 duration-200 border w-full ${borderColor} ${className} ${
            type === "password" ? "pr-10" : ""
          }`}
          onChange={(e) => {
            const newValue = e.target.value;
            setValue(newValue);
            if (props.onChange) {
              props.onChange(e);
            }
          }}
          {...props}
        />
        
        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      
      {error.length > 0 && (
        <div className="mt-1 text-sm text-red-600 space-y-1 pl-1">
          {error.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputField;
import React, {
  useState,
  useEffect,
  useId,
  forwardRef,
} from "react";

const InputField = forwardRef(
  (
    {
      label,
      type = "text",
      validate = () => [],
      successCheck = () => false,
      onValueChange = () => {},
      className = "",
      ...props
    },
    ref
  ) => {
    const id = useId();
    const [value, setValue] = useState("");
    const [error, setError] = useState([]);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
      const validationResult = validate(value);
      setError(validationResult);
      setSuccess(validationResult.length === 0 && successCheck(value));
    }, [value]);

  
    const borderColor = error.length
      ? "border-red-500"
      : success
      ? "border-green-500"
      : "border-gray-300";

    return (
      <div>
        {label && (
          <label htmlFor={id} className="block mb-1 font-medium pl-1 text-white">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          type={type}
          className={`px-3 py-2 rounded-lg bg-gray-950 text-white outline-none focus:bg-gray-600 duration-200 border w-full ${borderColor} ${className}`}
          {...(type !== "file" ? { value } : {})}
          onChange={(e) => {
            const v = type === "file" ? e.target.files?.[0] : e.target.value;
            setValue(v);
            onValueChange(v);
          }}
          {...props}
        />
        {error.length > 0 && (
          <div className="mt-1 text-sm text-red-600 space-y-1 pl-1">
            {error.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

export default InputField;
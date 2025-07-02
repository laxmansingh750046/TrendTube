import React, { useId } from 'react';

const InputField = function InputField(
  {
    label,
    type = 'text',
    className = '',
    ...props
  },
  ref
) {
  const id = useId();
  return (
    <div>
      {label && (
        <label className="inline-block mb-1 pl-1 font-medium" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-300 w-full ${className}`}
        ref={ref}
        id={id}
        {...props}
      />
    </div>
  );
};

export default React.forwardRef(InputField);

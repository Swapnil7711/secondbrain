import React from "react";

function PricingTile({
  className,
  label,
  tooltip,
}: {
  className?: string;
  label: string;
  tooltip?: string;
}) {
  return (
    <li className="flex space-x-3 items-center">
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        className="h-4 w-4 flex-shrink-0 text-gray-500"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
        ></path>
      </svg>
      <span className={`text-md text-gray-800 ${className}`}>{label}</span>
    </li>
  );
}

export default PricingTile;

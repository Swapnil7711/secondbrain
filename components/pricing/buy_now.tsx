import React from "react";

export default function SubscribeNowBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: any;
}) {
  return (
    <div className="flex-col">
      <button
        onClick={onClick}
        className="shadow-lg mt-3 block w-full rounded-md border border-gray-800 bg-gray-800 py-2 text-center text-sm font-semibold text-white hover:bg-gray-900"
      >
        {label}
      </button>
      {/* <a href='https://calendly.com/indianappguy/15-min-call?month=2022-11' className="mt-3 block w-full rounded-md border border-gray-100 bg-white py-2 text-center text-sm font-semibold text-gray-800 hover:bg-gray-100">Book a Free demo </a> */}
    </div>
  );
}

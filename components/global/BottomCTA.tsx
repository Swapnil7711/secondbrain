import React from "react";
import TwoButtons from "../home/TwoButtons";

export default function BottomCTA() {
  return (
    <div className="topo_pattern">
      <div className="mx-auto max-w-xl py-16 px-6 text-center sm:py-20 lg:px-8">
        <h2 className="text-3xl font-bold sm:text-4xl"></h2>
        <p className="mt-5 text-lg leading-6"></p>
        <TwoButtons />
      </div>
    </div>
  );
}

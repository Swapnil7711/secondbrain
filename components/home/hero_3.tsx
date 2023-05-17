import Image from "next/image";
import React, { useContext, useState } from "react";
import ReactPlayer from "react-player";
import TwoButtons from "./TwoButtons";

function Hero3({ className }: { className?: string }) {
  return (
    <div className={`overflow-x-hidden ${className}`}>
      <section className="mt-10 pb-2 sm:pt-10 topo_pattern">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:leading-tight sm:text-5xl lg:text-5xl lg:leading-tight font-pj">
              Train a ChatGPT-like chatbot for your website
            </h1>
            <p className="mt-1 max-w-2xl mx-auto px-6 py-2 text-lg font-inter">
              {`Enter a link to your website and you'll have access to a ChatGPT-like chatbot capable of answering any questions related to it. Then, add a chat widget to your website. or embed it anywhere`}
            </p>
            {/* <AcceptEmail /> */}
            <TwoButtons />
          </div>
          <div className="relative">
            <div className="mx-auto max-w-4xl sm:px-4">
              <ReactPlayer
                className="storyPlayer__reactPlayer rounded-lg shadow-lg mx-auto"
                controls={true}
                width="100%"
                height={"500px"}
                url="https://getleda.wistia.com/medias/qlyqqx4l69"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero3;

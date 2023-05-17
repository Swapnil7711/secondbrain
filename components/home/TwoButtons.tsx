import Link from "next/link";
import React from "react";

export default function TwoButtons() {
  return (
    <div className="flex mx-auto w-full justify-center my-7">
      <div className="rounded-md shadow sm:mt-0 sm:flex-shrink-0">
        <Link
          href="/signup"
          type="submit"
          className="flex w-full items-center justify-center rounded-md py-3 px-5 text-base font-medium text-white bg-gray-800 focus:outline-none"
        >{`Create your free SecondBrain`}</Link>
      </div>
      {/* <div className="ml-3 rounded-md shadow sm:mt-0 sm:flex-shrink-0">
                <a href='https://www.youtube.com/watch?v=Gha61QsgH6A&list=PL7zrxebhUBolRmgBZ4Gvcyogm--A4a7Fn' type="submit" className="flex w-full items-center justify-center rounded-md border-2 border-gray-800 py-3 px-5 text-base font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">{`Video Tutorials`}</a>
            </div> */}
    </div>
  );
}

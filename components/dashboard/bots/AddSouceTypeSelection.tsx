import React, { useState } from "react";
import axios from 'axios';
import { supabase } from "@/utils/SupabaseClient";
import SourceList from "./SourceList";
import { showSnackbar } from "@/utils";
import AddPDFSource from "./AddPDFSource";
import AddTextSource from "./AddTextSource";
import AddURLSource from "./AddUrlSource";
import AddURLListSource from "./AddUrlListsSource";

function SourceTypeTile({
  title,
  description,
  selected,
  index,
  setSelected,
  Icon,
  iconType,
  pro,
  comingSoon,
}) {
  return (
    <div
      className={`border-transparent relative flex cursor-pointer rounded-lg bg-white p-4 ${comingSoon ? "opacity-50" : ""
        }`}
      role="radio"
      aria-checked="true"
      tabIndex={0}
      data-headlessui-state="checked"
      aria-labelledby="headlessui-label-:r7:"
      aria-describedby="headlessui-description-:r8:"
      onClick={() => {
        if (comingSoon) return;
        setSelected(index);
      }}
    >
      <span className="mr-2 flex-shrink-0 items-center">
        {iconType === "localsvg" && (
          <img src={`/assets/${Icon}`} className="h-6 w-6" />
        )}
      </span>
      <span className="flex flex-1">
        <span className="flex flex-col">
          <span
            className="block text-sm font-medium text-gray-900"
            id="headlessui-label-:rd:"
          >
            {title}
            {!comingSoon && pro && (
              <span className="ml-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Pro
              </span>
            )}
            {comingSoon && (
              <span className="ml-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                Coming Soon
              </span>
            )}
          </span>
          <span
            className="mt-1 flex items-center text-sm text-gray-500"
            id="headlessui-description-:r8:"
          >
            {description}
          </span>
        </span>
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="h-5 w-5 text-gray-600"
        style={{ visibility: selected === index ? "visible" : "hidden" }}
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
      <span
        className={`border ${selected === index ? `border-2 border-gray-500` : ``
          }  pointer-events-none absolute -inset-px rounded-lg`}
        aria-hidden="true"
      />
    </div>
  );
}

export default function AddSouceTypeSelection({ hideAddSourceOptions, customer, botInfo }) {
  const [selected, setSelected] = useState(0);

  const sources = [
    {
      title: "URL",
      description: "Answer from the content from a single webpage",
      icon: "add-link-icon.svg",
      iconType: "localsvg",
      pro: false,
      comingSoon: false,
    },
    {
      title: "PDF",
      description:
        "Upload document files containing text.",
      icon: "pdf-file-icon.svg",
      iconType: "localsvg",
      pro: false,
      comingSoon: false,
    },
    {
      title: "Text",
      description:
        "Just paste a bulk text.",
      icon: "pdf-file-icon.svg",
      iconType: "localsvg",
      pro: false,
      comingSoon: false,
    },
    // {
    //   title: "URL List",
    //   description: "Index all content from a bulk list of URLs",
    //   icon: "checklist-icon.svg",
    //   iconType: "localsvg",
    //   pro: true,
    //   comingSoon: false,
    // },
    {
      title: "Document",
      description:
        "Upload a document file containing text (Text, Office, PDF, HTML, EML, etc)",
      icon: "text-document-add-icon.svg",
      iconType: "localsvg",
      pro: false,
      comingSoon: true,
    },
    {
      title: "Sitemap",
      description:
        "Answer from all content on a website refrenced by its XML sitemap",
      icon: "xml-file-icon.svg",
      iconType: "localsvg",
      pro: true,
      comingSoon: true,
    },
    {
      title: "Youtube",
      description:
        "Answer questions based on the transcripts of a YouTube video or channel",
      icon: "youtube-icon.svg",
      iconType: "localsvg",
      pro: true,
      comingSoon: true,
    },
  ];

  return (
    <div className="mt-12 mb-4 rounded-lg bg-white">
      <div
        id="headlessui-radiogroup-:r4:"
        role="radiogroup"
        aria-labelledby="headlessui-label-:r5:"
      >
        <h3 className="text-xl font-semibold my-2">Add Source</h3>
        <label className="mb-2 text-sm font-medium text-gray-700" role="none">
          Source type
        </label>
        <div
          className="mb-12 mt-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3 xl:grid-cols-4"
          role="none"
        >
          {sources.map((source, index) => (
            <SourceTypeTile
              index={index}
              key={source.title}
              title={source.title}
              description={source.description}
              selected={selected}
              setSelected={setSelected}
              Icon={source.icon}
              iconType={source.iconType}
              pro={source.pro}
              comingSoon={source.comingSoon}
            />
          ))}
        </div>

        {/* depending on source show add option */}
        {selected === 0 && <AddURLSource customer={customer} hideAddSourceOptions={hideAddSourceOptions} botInfo={botInfo} />}

        {selected === 1 && <AddPDFSource customer={customer} hideAddSourceOptions={hideAddSourceOptions} botInfo={botInfo} />}

        {selected === 2 && <AddTextSource customer={customer} hideAddSourceOptions={hideAddSourceOptions} botInfo={botInfo} />}

        {/* {selected === 3 && <AddURLListSource customer={customer} hideAddSourceOptions={hideAddSourceOptions} botInfo={botInfo} />} */}
      </div>
    </div>
  );
}

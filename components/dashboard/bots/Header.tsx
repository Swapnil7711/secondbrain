import { Fragment } from "react";
import {
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { ChatBubbleBottomCenterIcon, EyeIcon, LanguageIcon, PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import EmbedInfoPopup from "@/components/global/EmbedInfoPopup";
import ShareChatbot from "@/components/global/ShareChatbot";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BotPageHeader({ botInfo }) {

  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {botInfo.name}
          </h2>
          {/* <div className="ml-3 flex flex-shrink-0 justify-start h-fit">
            {botInfo.is_active ? (
              <span
                style={{ fontSize: "13px" }}
                className="px-2.5 text-xm inline-flex items-center rounded-full bg-teal-100 font-medium text-teal-800 py-1"
              >
                Active
              </span>
            ) : (
              <span
                style={{ fontSize: "13px" }}
                className="px-2.5 text-xm inline-flex items-center rounded-full bg-yellow-100 font-medium text-yellow-800 py-1"
              >
                Awaiting Sources
              </span>
            )}
          </div> */}
        </div>
      </div>
      <div className="mt-5 flex lg:mt-0 lg:ml-4">
        <div className="flex">
          <EmbedInfoPopup bot_id={botInfo.bot_id} />
          <ShareChatbot className="ml-2" bot_id={botInfo.bot_id} />
          <Link href={'/app/bots/' + botInfo.bot_id + '/settings'}
            type="button"
            className="ml-2 mt-2 p-1 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-zinc-300">
            Settings
          </Link>
        </div>

        {/* Dropdown */}
        <Menu as="div" className="relative ml-3 sm:hidden">
          <Menu.Button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
            More
            <ChevronDownIcon
              className="-mr-1 ml-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 -mr-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    View
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

import { Fragment, ReactComponentElement, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3BottomLeftIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronRightIcon,
  CloudIcon,
  CreditCardIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "@/utils/SupabaseClient";
import { showSnackbar } from "@/utils";

const navigation = [
  { name: "Dashboard", href: "/app", icon: HomeIcon, current: true },
  {
    name: "Bots",
    href: "/app/bots",
    icon: ChatBubbleOvalLeftEllipsisIcon,
    current: false,
  },
  // { name: "Team", href: "/app/team", icon: UsersIcon, current: false },
  // {
  //   name: "Account",
  //   href: "/app/account",
  //   icon: CreditCardIcon,
  //   current: false,
  // },
  { name: "API", href: "/app/api", icon: CloudIcon, current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "/app/account" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardPage({
  userInfo,
  botInfo,
  title,
  pageProps,
  subPage,
}: {
  userInfo: any;
  botInfo?: any;
  title?: string;
  pageProps?: ReactComponentElement<any>;
  subPage?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    //    set current true in navigation where name === title
    navigation.forEach((item) => {
      if (item.name === title) {
        item.current = true;
      } else {
        item.current = false;
      }
    });
  }, [title]);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-100 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <Link href="/app">
                      <img
                        className="h-8 w-auto"
                        src="/assets/logo.svg"
                        alt="SecondBrain.fyi Logo"
                      />
                    </Link>
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-800 hover:bg-gray-700 hover:text-white",
                            "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-white"
                                : "text-gray-800 group-hover:text-gray-300",
                              "mr-4 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-100 bg-gray-100">
            <div className="flex h-16 flex-shrink-0 items-center  px-4">
              <Link href="/app">
                {" "}
                <img
                  className="h-8 w-auto"
                  src="/assets/logo.svg"
                  alt="SecondBrain.fyi Logo"
                />
              </Link>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-800 hover:bg-gray-700 hover:text-white",
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-white"
                          : "text-gray-800 group-hover:text-gray-300",
                        "mr-3 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:pl-64">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4">
              {/* <div className="flex flex-1">
                                <form className="flex w-full lg:ml-0" action="#" method="GET">
                                    <label htmlFor="search-field" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                                            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="search-field"
                                            className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 sm:text-sm"
                                            placeholder="Search"
                                            type="search"
                                            name="search"
                                        />
                                    </div>
                                </form>
                            </div> */}
              <div className="max-w-xl flex items-center">
                <h1 className="text-2xl ml-4 flex font-semibold text-gray-900">
                  {subPage ? (
                    <div className="flex items-center">
                      <Link className="mr-3" href="/app/bots">{title}</Link>
                      <ChevronRightIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <Link
                        href={botInfo ? `/app/bots/${botInfo.bot_id}` : `/app/bots`}
                        className="ml-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        {subPage}
                      </Link>
                    </div>
                  ) : (
                    title
                  )}
                </h1>
              </div>
              <div className="ml-4 flex items-center lg:ml-6">
                {/* <button
                                    type="button"
                                    className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                </button> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 border-2 pr-2 focus:ring-gray-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      {/* <img
                                                className="h-8 w-8 rounded-full"
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            /> */}
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
                        <span className="text-sm font-medium leading-none text-white">
                          {userInfo?.email?.substring(0, 1).toUpperCase()}
                        </span>
                      </span>
                      <p className="ml-2">{userInfo?.email}</p>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) =>
                            item.name === "Sign out" ? (
                              <button
                                onClick={async () => {
                                  const { error } = await supabase.auth.signOut()
                                  if (error) showSnackbar(error.message);
                                  router.push("/signin");
                                }}
                                className={classNames(
                                  active ? "bg-gray-100 w-full text-left" : "",
                                  "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                                )}
                              >
                                Sign Out
                              </button>
                            ) : (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100 w-full" : "",
                                  "block px-4 py-2 text-sm text-gray-700 w-full"
                                )}
                              >
                                {item.name}
                              </a>
                            )
                          }
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {pageProps}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

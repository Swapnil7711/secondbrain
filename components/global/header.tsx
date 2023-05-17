import { UserContext } from "@/contexts/user-context";
import { showSnackbar, tallyFormID } from "@/utils";
import { supabase } from "@/utils/SupabaseClient";
import { Menu, Transition } from "@headlessui/react";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useContext, useState } from "react";

function Header() {
  const [customer, setCustomer] = useContext(UserContext).customer;
  const router = useRouter();

  var headerOptions = [
    {
      label: "Pricing",
      link: "/pricing",
    },
    // {
    //     label: "Help Docs",
    //     link: "/help"
    // },
  ];

  const userNavigation = [
    { name: "Your Dashboard", href: "/app" },
    { name: "Your Profile", href: "#" },
    { name: "Settings", href: "/app/account" },
    { name: "Sign out", href: "#" },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }


  return (
    <header className="bg-white">
      {/*  sticky top-0 z-50 */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-gray-100 py-4 lg:border-none">
          <div className="flex items-center">
            <Link href={"/"} title="link to homepage">
              <span className="sr-only">secondbrain.fyi</span>
              <Image
                height={40}
                width={40}
                className="h-10 w-auto"
                src="/assets/logo.svg"
                alt=""
              />
            </Link>

            <div className="hidden sm:flex ml-10 items-center space-x-8">
              {/* {headerOptions.map((option) => (
                <Link
                  title={`link to ${option.label}`}
                  key={option.link}
                  href={option.link}
                  className="text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  {option.label}
                </Link>
              ))} */}
              <Link
                className="flex text-base font-medium text-gray-700 hover:text-gray-900"
                href={`/get-started`}
              >{`Get Started`}</Link>
              <Link
                className="flex text-base font-medium text-gray-700 hover:text-gray-900"
                href={`/pricing`}
              >{`Pricing`}</Link>
              <Link
                className="flex text-base font-medium text-gray-700 hover:text-gray-900"
                href={`/blog`}
              >{`Blog`}</Link>
              <Link
                className="flex text-base font-medium text-gray-700 hover:text-gray-900"
                href={`/updates`}
              >{`What's New`}
              </Link>
              <Link
                className="text-base font-medium text-[#19494b] hover:text-gray-900"
                href={`https://secondbrain.getrewardful.com/signup`}
              >{`Affiliate Program`}
              </Link>
              <Link
                className="text-base font-medium text-gray-700 hover:text-gray-900"
                href={
                  `https://tally.so#tally-open=${tallyFormID}&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=0`
                }
              >
                Contact Us
              </Link>
            </div>
          </div>
          {customer ? (<Menu as="div" className="relative ml-3">
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
                    {customer?.email?.substring(0, 1).toUpperCase()}
                  </span>
                </span>
                <p className="ml-2">{customer?.email}</p>
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
          </Menu>) : <div className="hidden ml-10 space-x-4 sm:flex items-center">
            <Link
              href="/signin"
              className="text-base font-medium text-gray-700 hover:text-gray-900"
            >
            </Link>
            <Link
              href="/signup"
              className="flex w-full items-center justify-center rounded-md py-3 px-5 text-base font-medium text-white bg-gray-800 focus:outline-none"
            >
              Try Free
            </Link>
          </div>}
        </div>
      </nav>
    </header>
  );
}

export default Header;

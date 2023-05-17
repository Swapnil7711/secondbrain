import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { showSnackbar } from "../utils";
import PageSeo from "../components/global/page_seo";
import Header from "../components/global/header";
import { UserContext } from "../contexts/user-context";
import { supabase } from "@/utils/SupabaseClient";
import { CheckNAddUserInfo } from "@/supabase/tables";

function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useContext(UserContext).customer;
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false)

  async function signInwithEmailPass(e) {
    e.preventDefault();
    setloading(true)
    try {
      if (email && password) {
        const resp = await supabase.auth.signInWithPassword(
          {
            email: email,
            password: password
          }
        )
        if (resp.error) throw resp.error;
        const userId = resp.data.user?.id;
        await CheckNAddUserInfo(resp.data.user)
        console.log(`user id: ${userId}`);
        router.push("/app");
      }
      setloading(false)
    } catch (error) {
      console.log(error);
      showSnackbar(`Hey!, Error: ${error}`);
      setloading(false)
    }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    }).then((resp: any) => {
      console.log(`resp: ${resp}`);
      // CheckNAddUserInfo(resp.data.user);
      // router.push("/app");
    }).catch((error: any) => {
      console.log(`error: ${error}`);
    });
  }

  return (
    <>
      <PageSeo
        title="Sign In ~ SecondBrain.fyi"
        description="Sign In to SecondBrain.fyi"
        slug="/signin"
      />
      <Header />
      <div className="overflow-x-hidden ">
        <section className="">
          <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex min-h-full">
              <div className="mx-auto flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                  <div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                      Sign In
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Don’t have an account?
                      <Link
                        href="/signup"
                        className="font-medium text-blue-600 hover:text-blue-500 mx-1"
                      >
                        SignUp
                      </Link>{" "}
                      to get started.
                    </p>
                  </div>
                  <div className="mt-8">
                    {/* <div>
                      <button
                        onClick={() => signInWithGoogle()}
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-transparent bg-[#ea4335] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#ce3d2f] focus:outline-none"
                      >
                        Sign In with Google
                      </button>
                      <div className="relative mt-6">
                        <div
                          className="absolute inset-0 flex items-center"
                          aria-hidden="true"
                        >
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-white px-2 text-gray-500">
                            Or continue with
                          </span>
                        </div>
                      </div>
                    </div> */}
                    <div className="mt-6">
                      <form action="#" method="POST" className="space-y-6">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email address
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) => setEmail(e.target.value)}
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          <div className="mt-1">
                            <input
                              onChange={(e) => setPassword(e.target.value)}
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          {/* <div className="flex items-center">
                                                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                                                    </div> */}
                          <div className="text-sm">
                            <Link
                              href="/forgot"
                              className="font-medium text-blue-600 hover:text-blue-500"
                            >
                              Forgot your password?
                            </Link>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={(e) => signInwithEmailPass(e)}
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            {loading ? `Signing In...` : `Sign In`}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="relative hidden w-0 flex-1 lg:block">
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                  alt=""
                />
              </div> */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default SignIn;

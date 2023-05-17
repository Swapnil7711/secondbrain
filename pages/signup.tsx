import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { ValidateEmail, showSnackbar } from "../utils";
import PageSeo from "../components/global/page_seo";
import Header from "../components/global/header";
import { supabase } from "@/utils/SupabaseClient";
import { CheckNAddUserInfo } from "@/supabase/tables";

function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false)

  async function signUpwithEmailPass(e) {
    e.preventDefault();
    setloading(true)
    try {
      if (email && password) {
        var resp = await supabase.auth.signUp(
          {
            email: email,
            password: password
          }
        )
        if (resp.error) {
          console.log(`error signUpwithEmailPass: ${resp.error}`);
          // check if the error message contains "User already registered"
          if (resp.error.message.includes("User already registered")) {
            // sign in the user
            console.log(`User already registered, signing in`);
            resp = await supabase.auth.signInWithPassword(
              {
                email: email,
                password: password
              }
            );
          }
        }

        const userId = resp.data.user?.id;
        var sucess = CheckNAddUserInfo(resp.data.user);
        router.push("/app");
        console.log(`user id: ${userId}`);
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
    }).then(async (resp: any) => {
      console.log(`resp: ${resp}`);
      await CheckNAddUserInfo(resp.data.user);
      router.push("/app");
    }).catch((error: any) => {
      console.log(`error: ${error}`);
    });
  }

  // async function onSignUpWithEmailAndPassBtnClick(e: any) {
  //   e.preventDefault();
  //   console.log(`email:${email} password: ${password}`);
  //   let result = await SignUpWithEmailAndPass(email, password);
  //   if (result["status"] === "success") {
  //     if (result["user"]) {
  //       // setUser(user);
  //       // localStorage.setItem("user", JSON.stringify(user));
  //       router.push("/app");
  //     } else {
  //       showSnackbar("Opps, Not able to create account, Try Again!");
  //       // toast()
  //       //     .default("Opps", "Not able to create account, Try Again!")
  //       //     .with({ color: "bg-blue-800" })
  //       //     .show();
  //       console.log(`Console log ${result["message"]}`);
  //     }
  //   } else {
  //     showSnackbar(`Hey!, Error: ${result["message"]}`);
  //     //show toast with the error
  //     // toast()
  //     //     .warning("Hey!", `Error: ${result["message"]}`)
  //     //     .for(3000)
  //     //     .with({ color: "bg-blue-800" })
  //     //     .show();
  //     console.log(`Console log ${result["message"]}`);
  //   }
  //   //console.log(`user we get on signin emailandpass : ${user}`);
  // }

  // const onSignUpGoogleBtnClick = async () => {
  //   let user = await SignUpWithGoogle();
  //   if (user) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //     router.push("/app");
  //   }
  //   console.log(`user we get on signin google : ${user}`);
  // };

  return (
    <>
      <PageSeo
        title="Sign Up ~ SecondBrain.fyi"
        description="Sign Up to SecondBrain.fyi"
        slug="/signup"
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
                      Sign Up
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Already registered?
                      <Link
                        href="/signin"
                        className="font-medium text-blue-600 hover:text-blue-500 mx-1"
                      >
                        SignIn
                      </Link>{" "}
                      to your account.
                    </p>
                  </div>
                  <div className="mt-8">
                    {/* <div>
                      <button
                        onClick={() => signInWithGoogle()}
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-transparent bg-[#ea4335] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#ce3d2f] focus:outline-none"
                      >
                        Sign Up with Google
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
                                                    </div>  */}
                          {/* <div className="text-sm">
                                                        <Link href="/forgot" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?
                                                        </Link>
                                                    </div> */}
                        </div>
                        <div>
                          <button
                            onClick={(e) => signUpwithEmailPass(e)}
                            type="submit"
                            disabled={loading || !ValidateEmail(email) || password === ""}
                            className={`flex w-full justify-center rounded-md border border-transparent ${loading || !ValidateEmail(email) || password === "" ? "bg-gray-200 hover:bg-gray-300  cursor-not-allowed" : "bg-gray-800 hover:bg-gray-900 cursor-pointer"} py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
                          >
                            {loading ? (`Signing Up...`) : (`Sign Up`)}
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

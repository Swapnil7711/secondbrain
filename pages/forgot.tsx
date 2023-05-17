import React, { useState } from "react";
import Header from "../components/global/header";
import PageSeo from "../components/global/page_seo";
import { supabase } from "@/utils/SupabaseClient";
import { showSnackbar } from "@/utils";

function Forgot() {

  const [loading, setloading] = useState(false);
  const [myEmail, setMyEmail] = useState<string>("")

  async function signInWithEmail() {
    console.log(myEmail)
    if (!myEmail) return showSnackbar("Please enter your email address");
    setloading(true);
    const { data, error } = await supabase.auth.signInWithOtp({
      email: myEmail,
      options: {
        emailRedirectTo: 'https://www.secondbrain.fyi',
      },
    })
    if (error) {
      showSnackbar(error.message)
    }
    // on success, user will be redirected to emailRedirectTo
    if (data) showSnackbar("Check your email for magiclink to login")
    setloading(false);
  }

  return (
    <>
      <PageSeo
        title="Forgot Password ~ nt.ink"
        description="Forgot your password? Reset it here."
        slug="/forgot"
      />
      <Header />
      <div className="overflow-x-hidden" style={{ minHeight: "70vh" }}>
        <section className="py-12  sm:pt-16">
          <div className="px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex min-h-full">
              <div className="mx-auto flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-md lg:w-96">
                  <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                      Send MagicLink to Login
                    </h2>
                    <p className="my-2 text-center text-gray-600">Just enter your email address and we will send magiclink to login</p>
                  </div>
                  <div className="mt-8">
                    <div className="mt-6">
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        signInWithEmail()
                      }} className="space-y-6">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email address
                          </label>
                          <div className="mt-1">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              onChange={(e) => setMyEmail(e.target.value)}
                              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            {loading ? `Sending...` : `Send MagicLink`}
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

export default Forgot;

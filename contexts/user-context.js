import { supabase } from "@/utils/SupabaseClient";
import React, { useState, createContext, useEffect } from "react";
import { auth } from "../firebase/firebaseClient";
import { fetchUserByEmail } from "@/supabase/tables";

export const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // auth.onAuthStateChanged(function (user) {
    //   if (user) {
    //     // User is signed in.
    //     console.log(`user: ${JSON.stringify(user)} User is signed in`);
    //     setCustomer(user);
    //     // uploadUserInfo(user);
    //   } else {
    //     // No user is signed in.
    //     console.log(`user: ${JSON.stringify(user)} No user is signed in`);
    //     router.push("/signup");
    //   }
    // });

    const getUser = async () => {
      const user = await supabase.auth.getUser();
      console.log(`user: ${JSON.stringify(user)}`);
      if (user.data.user) {
        console.log(`User is signed in, user: ${JSON.stringify(user.data.user)}`);
        setCustomer(user.data.user);
        var userSupabaseInfo = await fetchUserByEmail(user.data.user.email);
        console.log(`userSupabaseInfo: ${JSON.stringify(userSupabaseInfo)}`);
        setCustomer({ ...user.data.user, ...userSupabaseInfo });
      } else {
        console.log(`No user is signed in, user: ${JSON.stringify(user)}`);
        // router.push("/signup");
      }
    }
    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        customer: [customer, setCustomer],
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

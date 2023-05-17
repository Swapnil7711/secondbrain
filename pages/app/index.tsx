import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import DashboardPage from "../../components/dashboard/Dashboard";
import StatsComponent from "../../components/dashboard/Stats";
import { UserContext } from "../../contexts/user-context";

export default function App() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<User>();
  const [customer, setCustomer] = useContext(UserContext).customer;

  // create a pageProps object to pass to the DashboardPage component
  function PageProps() {
    return (
      <div>
        <StatsComponent customer={customer} />
      </div>
    );
  }

  return (
    <div>
      <DashboardPage
        userInfo={customer}
        title="Dashboard"
        pageProps={<PageProps />}
      />
    </div>
  );
}

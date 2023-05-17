import DashboardPage from "@/components/dashboard/Dashboard";
import PageSeo from "@/components/global/page_seo";
import { UserContext } from "@/contexts/user-context";
import React, { useContext } from "react";

export default function API() {
  const [customer, setCustomer] = useContext(UserContext).customer;

  // create a pageProps object to pass to the DashboardPage component
  function PageProps() {
    return (
      <div>
        <p>Coming Soon...</p>
      </div>
    );
  }


  return <div>
    <PageSeo
      title="Account"
      description="Manage your account"
      slug="/app/account"
    />
    <DashboardPage
      userInfo={customer}
      title="API"
      pageProps={<PageProps />}
    />
  </div>;
}

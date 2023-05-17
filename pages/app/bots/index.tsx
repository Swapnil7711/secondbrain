import PageSeo from "@/components/global/page_seo";
import { getAllBotsInfo } from "@/supabase/tables";
import { User } from "@supabase/supabase-js";
import React, { useContext, useEffect, useState } from "react";
import BotsListTile from "../../../components/dashboard/bots/BotsListTile";
import BotsEmptyState from "../../../components/dashboard/bots/EmptyState";
import AddBotSidebar from "../../../components/dashboard/bots/Sidebar";
import DashboardPage from "../../../components/dashboard/Dashboard";
import { UserContext } from "../../../contexts/user-context";

export default function Bots() {
  const [customer, setCustomer] = useContext(UserContext).customer;
  const [open, setOpen] = useState(false);
  const [bots, setBots] = useState([]);

  // create a pageProps object to pass to the DashboardPage component
  function PageProps() {
    return (
      <div>
        <AddBotSidebar open={open} setOpen={setOpen} />
        {bots.length > 0 && <BotsListTile bots={bots} />}
        <BotsEmptyState bots={bots} customer={customer} showAdd={showAdd} />
      </div>
    );
  }

  function showAdd() {
    setOpen(true);
  }

  async function getSetBots() {
    if (!customer) return;
    console.log(`getting bots for ${customer?.user_id}`);
    var mybots = await getAllBotsInfo(customer?.user_id);
    console.log(mybots);
    setBots(mybots);
  }

  useEffect(() => {
    getSetBots();
  }, [customer]);

  return (
    <div>
      <PageSeo
        title="Bots"
        description="Manage your bots and their settings"
        slug="/app/bots"
      />
      <DashboardPage
        userInfo={customer}
        title="Bots"
        pageProps={<PageProps />}
      />
    </div>
  );
}

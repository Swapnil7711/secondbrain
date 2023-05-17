import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardPage from "../../../../components/dashboard/Dashboard";
import { UserContext } from "../../../../contexts/user-context";
import BotPageHeader from "../../../../components/dashboard/bots/Header";
import AddSouceTypeSelection from "../../../../components/dashboard/bots/AddSouceTypeSelection";
import PageSeo from "../../../../components/global/page_seo";
import BotsPageEmptyState from "../../../../components/dashboard/bots/BotsPageEmptyState";
import { getBotInfo, getSources } from "@/supabase/tables";
import ChatWindow from "@/components/global/ChatWindow";

export default function BotPage() {
  const [customer, setCustomer] = useContext(UserContext).customer;
  const [botInfo, setBotInfo] = useState(null);
  const [gettingBotInfo, setgettingBotInfo] = useState(true);
  const [sources, setSources] = useState([]);
  const [showAddSource, setshowAddSource] = useState(false);

  const router = useRouter();
  const { botid } = router.query as { botid: string };

  async function getBotInfoSupabase() {
    setgettingBotInfo(true)
    var botInfoLocal = await getBotInfo(botid);
    setBotInfo(botInfoLocal.data[0]);
    setgettingBotInfo(false)
    console.log(`botInfoLocal:`, botInfoLocal);
  }

  async function getSourcesSupabase() {
    var sources = await getSources(botid);
    setSources(sources.data);
    console.log(`sources:`, sources);
  }

  useEffect(() => {
    if (customer?.id) {
      getBotInfoSupabase();
      getSourcesSupabase();
    }
  }, [customer]);

  type ChatMessage = {
    sender: 'user' | 'ai';
    content: string;
  };

  interface ChatProps {
    chatContent: ChatMessage[];
  }

  function showAddSourceOptions() {
    setshowAddSource(true);
  }
  function hideAddSourceOptions() {
    setshowAddSource(false);
    // fetch sources again
    getSourcesSupabase();
  }

  // create a pageProps object to pass to the DashboardPage component
  function PageProps() {
    return (
      <div>
        <PageSeo
          title={botInfo?.name}
          description="Manage your bots and their settings"
          slug={`/app/bots/${botid}`}
        />
        <BotPageHeader botInfo={botInfo} />

        {/* chat list */}
        {sources.length > 0 ?
          (<ChatWindow classNames="mt-5" botid={botid} isEmbed={false} />) :
          showAddSource ? (
            <AddSouceTypeSelection botInfo={botInfo} customer={customer} hideAddSourceOptions={hideAddSourceOptions} />
          ) : (
            <BotsPageEmptyState
              showAddSource={showAddSourceOptions}
              botInfo={botInfo}
            />
          )
        }

      </div >
    );
  }

  function NoBotFoundPageProps() {
    return (
      <p>
        No bot found with id: {botid}. Please check the bot id and try again.
      </p>
    );
  }

  return (
    <div>
      <PageSeo
        title="Bots"
        description="SecondBrain.fyi Dashboard"
        slug={`https://secondbrain.fyi/bots/${botid}`}
      />
      <DashboardPage
        userInfo={customer}
        title="Bots"
        subPage={botInfo ? botInfo.name : "Loading..."}
        pageProps={botInfo ? <PageProps /> : gettingBotInfo ? <p>Loading....</p> : <NoBotFoundPageProps />}
      />
    </div>
  );
}

import { fetchBotCount, fetchQuestionCount, fetchSourceCount, fetchUserPlan } from "@/supabase/tables";
import {
  AdjustmentsHorizontalIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const stats = [
  {
    id: 1,
    name: "Bots",
    stat: "0",
    icon: ChatBubbleOvalLeftEllipsisIcon,
    limit: "1",
    link: "/app/bots",
    linklabel: "View all bots",
  },
  { id: 2, name: "Sources", stat: "0", icon: DocumentTextIcon, limit: "3" },
  // {
  //   id: 3,
  //   name: "Source Pages",
  //   stat: "0",
  //   icon: Square3Stack3DIcon,
  //   limit: "50",
  // },
  {
    id: 4,
    name: "Questions",
    stat: "0",
    icon: QuestionMarkCircleIcon,
    limit: "0",
  },
  {
    id: 5,
    name: "Current Plan",
    stat: "Free",
    icon: AdjustmentsHorizontalIcon,
    link: "/pricing",
    linklabel: "Upgrade",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function StatsComponent({ customer }) {
  const [statsData, setStatsData] = useState(stats);
  async function fetchBotCountFromSupabase() {
    console.log("getfetchBotCountFromSupabase");
    console.log(`StatsComponent userInfo.user_id:`, customer?.user_id);
    var count = await fetchBotCount(customer?.user_id);
    console.log(`count: ${count}`);
    // update stats for bot
    setStatsData(prevStats => {
      const newStats = [...prevStats];
      newStats[0].stat = `${count}`;
      return newStats;
    });
  }

  async function fetchQuestionCountFromSupabase() {
    console.log("getfetchQuestionCountFromSupabase");
    console.log(`fetchQuestionCountFromSupabase userInfo.user_id:`, customer?.user_id);
    var count = await fetchQuestionCount(customer?.user_id);
    console.log(`count: ${count}`);
    // update stats for bot
    setStatsData(prevStats => {
      const newStats = [...prevStats];
      newStats[2].stat = `${count}`;
      return newStats;
    });
  }

  async function fetchUserPlanFromSupabase() {
    if (!customer?.id) return;
    console.log("getfetchUserPlanFromSupabase");
    console.log(`fetchUserPlanFromSupabase userInfo.user_id:`, customer?.user_id);
    var userPlan = await fetchUserPlan(customer?.user_id);
    console.log(`userPlan: ${userPlan}`);
    // update stats for bot
    if (userPlan !== null) {
      setStatsData(prevStats => {
        const newStats = [...prevStats];
        newStats[3].stat = `${userPlan}`;
        return newStats;
      });
    }

    switch (userPlan.toLowerCase()) {
      case "free":
        setStatsData(prevStats => {
          const newStats = [...prevStats];
          newStats[0].limit = "1"; //bots
          newStats[1].limit = "3"; //sources
          newStats[2].limit = "50"; //questions
          return newStats;
        });
        break;
      case "hobby":
        setStatsData(prevStats => {
          const newStats = [...prevStats];
          newStats[0].limit = "3"; //bots
          newStats[1].limit = "25"; //sources
          newStats[2].limit = "1000"; //questions
          return newStats;
        });
        break;
      case "power":
        setStatsData(prevStats => {
          const newStats = [...prevStats];
          newStats[0].limit = "10"; //bots
          newStats[1].limit = "500"; //sources
          newStats[2].limit = "5000"; //questions
          return newStats;
        });
        break;
      case "pro":
        setStatsData(prevStats => {
          const newStats = [...prevStats];
          newStats[0].limit = "30"; //bots
          newStats[1].limit = "1000"; //sources
          newStats[2].limit = "10000"; //questions
          return newStats;
        });
        break;
      default:
        setStatsData(prevStats => {
          const newStats = [...prevStats];
          newStats[0].limit = "1"; //bots
          newStats[1].limit = "3"; //sources
          newStats[2].limit = "50"; //questions
          return newStats;
        });
        break;
    }

    // TODO: add for other plans
  }

  async function fetchSourceCountFromSupabase() {
    console.log("getfetchBotCountFromSupabase");
    console.log(`fetchSourceCountFromSupabase userInfo.user_id:`, customer?.user_id);
    var sourceCount = await fetchSourceCount(customer?.user_id);
    console.log(`sourceCount: ${sourceCount}`);
    // update stats for bot
    setStatsData(prevStats => {
      const newStats = [...prevStats];
      newStats[1].stat = `${sourceCount}`;
      return newStats;
    });
  }

  useEffect(() => {
    fetchBotCountFromSupabase();
    fetchSourceCountFromSupabase();
    fetchQuestionCountFromSupabase();
    fetchUserPlanFromSupabase();
  }, []);

  return (
    <div>
      {/* <h3 className="text-base font-semibold leading-6 text-gray-900">Last 30 days</h3> */}
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {statsData.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-gray-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 mt-1 flex items-baseline pb-6 sm:pb-7">
              <p className="text-lg font-medium text-gray-900">
                {item.stat}{" "}
                {item.limit && (
                  <span className="text-sm text-gray-500">/ {item.limit}</span>
                )}
              </p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                {item.link && (
                  <div className="text-sm">
                    <a
                      href={item.link}
                      className="font-medium text-gray-600 hover:text-gray-500"
                    >
                      {item.linklabel}
                      <span className="sr-only">{item.linklabel}</span>
                    </a>
                  </div>
                )}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

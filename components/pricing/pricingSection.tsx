import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { showSnackbar } from "../../utils";
import SubscribeNowBtn from "./buy_now";
import PricingTile from "./pricing_tile";
import { useCookies } from "react-cookie";
import Link from "next/link";
import { Plan } from "../../interfaces";

const loadStripeSdk = async (sessionId: string) => {
  if (!sessionId) return;
  localStorage.setItem("sessionId", sessionId);
  const stripe = await loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_API_KEY as string
  );

  stripe
    ?.redirectToCheckout({
      sessionId,
    })
    .then(function (result) {
      if (result.error) {
        alert(
          `Checkout failed with error - ${result?.error?.message}. Please report the issue at support@secondbrain.fyi`
        );
      }
    })
    .catch(function (e) {
      alert(
        `Checkout failed with error - ${e?.message}. Please report the issue at support@secondbrain.fyi`
      );
    });
};

export default function CompanyPricingSection({
  country,
}: {
  country: "in" | "nonIn";
}) {
  const appName = "secondbrain.fyi";
  const [isyearly, setisyearly] = useState(false);
  const [cookies, setCookie] = useCookies(["Rewardful.referral"]);
  const [pricingPlan, setPricingPlan] = useState<Plan | undefined>();
  const [isPro, setisPro] = useState(true);

  const Plans = {
    starter: {
      features: [
        `Create 1 AskAI`,
        `Add 3 pieces of content`,
        `Ask 50 questions/mo`,
        `Email support`,
        `Add files and links`,
        `SecondBrain.fyi branding`,
        `Share via link or embed`,
      ],
      cta: `Try out SecondBrain.fyi`,
    },
    hobby: {
      features:
        [
          `Create 3 AskAIs`,
          `Add 25 pieces of content`,
          `Ask 1,000 questions/mo`,
          `Web chat + email support`,
          `Add files and links`,
          `Remove AskAI branding`,
          `Share via link, embed or API`,
          `Analytics + question export`
        ],
      cta: `Launch my 1st Secondbrain`
    },
    pro: {
      features: [
        `Create 10 AskAIs`,
        `Add 500 pieces of content`,
        `Ask 10,000 questions/mo`,
        `Priority email + Zoom support`,
        `Add files and links`,
        `Remove AskAI branding`,
        `Share via link, embed or API`,
        `Customise your AskAI`,
        `Analytics + question export`
      ],
      cta: `Get SecondBrain Pro`
    },
    beast: {
      features: [
        `Unlimited AskAIs`,
        `Add 5,000 pieces of content`,
        `Unlimited questions`,
        `Priority email + Zoom support`,
        `Add files and links`,
        `Remove AskAI branding`,
        `Share via link, embed or API`,
        `Customise your AskAI`,
        `Upload content API`,
        `Site crawl + automatic updates`,
        `Analytics + question export`
      ],
      cta: `Go unlimited`
    },
  };

  const checkout = async (plan: Plan, yearlyornot: boolean) => {
    setPricingPlan(plan);
    console.log(`plan:${plan} yearlyornot:${yearlyornot}`);
    var rewardFulId = cookies["rewardful.referral"]
      ? cookies["rewardful.referral"]["id"]
      : "";

    const sessionIdResp = await fetch(`/api/checkout`, {
      method: "post",
      body: JSON.stringify({
        plan,
        yearlyornot,
        rewardFulId,
      }),
    });
    const { sessionId } = await sessionIdResp.json();

    loadStripeSdk(sessionId);
  };

  var selectedTimeStyle =
    "relative w-1/2 whitespace-nowrap rounded-md border-gray-200 bg-white py-2 text-sm font-medium text-gray-900 shadow-sm focus:z-10 focus:outline-none sm:w-auto sm:px-8";
  var deselectedTimeStyle =
    "relative ml-0.5 w-1/2 whitespace-nowrap rounded-md border border-transparent py-2 text-sm font-medium text-gray-700 focus:z-10 focus:outline-none sm:w-auto sm:px-8";

  //  timer stuff
  const [days, setdays] = useState(0);
  const [hours, sethours] = useState(0);
  const [minutes, setminutes] = useState(0);
  const [seconds, setseconds] = useState(0);

  useEffect(() => {
    var dest = new Date("nov 27,2022 12:00:00").getTime();
    var x = setInterval(function () {
      var now = new Date().getTime();
      var diff = dest - now;
      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);
      // document.getElementById('coupon-date-expiry').innerHTML = "<div>" + days + "<span>Days</span> </div> <div>" + hours + "<span>Hrs</span> </div> <div>" + minutes + "<span>Min</span> </div> <div>" + seconds + "<span>Sec</span></div>";
      setdays(days);
      sethours(hours);
      setminutes(minutes);
      setseconds(seconds);
    }, 1000);
  }, []);

  function onSwitchChange() {
    setisyearly(!isyearly);
  }

  function WhatsIncluded({ list }) {
    return (
      <div className="px-6 pt-6 pb-8">
        <h3 className="text-sm font-medium text-gray-900">{`What's included`}</h3>
        <ul role="list" className="mt-6 space-y-4">
          {list.map((feature, index) => (
            <PricingTile
              key={index}
              className={index < 2 ? `font-medium` : ``}
              label={feature}
            />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className=" topo_pattern">
      <div className="mx-auto max-w-7xl py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col mx-auto max-w-3xl">
          <h1 className="max-w-xl mx-auto leading-tight text-3xl font-bold tracking-tight sm:text-center">
            <span className="block">Pricing</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 sm:text-center max-w-xl mx-auto">
            Save money and time with secondbrain.fyi We offer a variety of plans to fit your needs. Need a custom plan? Contact us.
          </p>
          {/* <div className="relative mt-6 flex self-center rounded-lg bg-gray-100 p-0.5 sm:mt-8 border">
                        <button onClick={() => setisPro(true)} type="button" className={!isPro ? deselectedTimeStyle : selectedTimeStyle}>Prof</button>
                        <button onClick={() => setisPro(false)} type="button" className={!isPro ? selectedTimeStyle : deselectedTimeStyle}>Team</button>
                    </div> */}
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
          <div className="divide-y bg-white divide-gray-200 rounded-lg border-2">
            <div className="p-6">
              <div className="flex items-center">
                <h2 className="text-lg uppercase font-medium leading-6 text-gray-900">{`${isPro ? `PRO` : `Team`
                  } Unlimited`}</h2>
              </div>
              <p className="my-4 text-4xl font-bold tracking-tight text-gray-900">
                {country == "in" ? `₹` : `$`}
                <span id="basicPlanPrice">{country == "in" ? `661` : `8`}</span>
                <span className="text-base font-medium text-gray-500ml-1 ml-1">
                  /month
                </span>
              </p>
              <span></span>
              <SubscribeNowBtn
                onClick={() => {
                  // checkout("unlimited", false);
                }}
                label={`Subscribe to Unlimited Monthly`}
              />
              <a
                href="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-3R1723253X273000BMO44VOI"
                className="mt-3 block w-full rounded-md border border-gray-100 bg-white py-2 text-center text-sm font-semibold text-gray-800 hover:bg-gray-100"
              >
                Pay with Paypal
              </a>
              <p className="text-sm mt-3 text-gray-600">
                <span className="underline">
                  Use same gmail id for purchase
                </span>{" "}
                with which you use secondbrain.fyi
              </p>
            </div>
            <WhatsIncluded list={Plans.starter.features} />
          </div>
          <div className="divide-y bg-white rounded-lg border-2 border-teal-600">
            <div className="absolute transform translate-y-px">
              <div className="flex justify-center transform -translate-y-1/2">
                <span className="inline-flex rounded-full bg-teal-600 px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white ml-4">
                  Popular
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center">
                <h2 className="text-lg uppercase font-medium leading-6 text-gray-900">{`${isPro ? `PRO` : `Team`
                  } Unlimited`}</h2>
                <span className="font-medium mx-2 px-2 py-1 bg-green-300 rounded-full">
                  24% OFF
                </span>
              </div>
              <p className="my-4 text-4xl font-bold tracking-tight text-gray-900">
                {country == "in" ? `₹` : `$`}
                <span id="basicPlanPrice">
                  {country == "in" ? `5955` : `72`}
                </span>
                <span className="text-base font-medium text-gray-500ml-1 ml-1">
                  /year
                </span>
              </p>
              <SubscribeNowBtn
                onClick={() => {
                  // checkout("unlimited", true);
                }}
                label={`Subscribe to Unlimited Yearly`}
              />
              <a
                href="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-9HD45647JG5921622MP5ZJOI"
                className="mt-3 block w-full rounded-md border border-gray-100 bg-white py-2 text-center text-sm font-semibold text-gray-800 hover:bg-gray-100"
              >
                Pay with Paypal
              </a>
              <p className="text-sm mt-3 text-gray-600">
                <span className="underline">
                  Use same gmail id for purchase
                </span>{" "}
                with which you use secondbrain.fyi
              </p>

              {/* <SubscribeNowBtn onClick={() => {
                                checkout({
                                    lineItems: [{
                                        price: 'price_1M8aysSJq1rIdDs9ldyafkdA',
                                        quantity: 1,
                                    },],
                                });
                            }} label={`Get ${appName} Unlimited, Yearly`} /> */}
              {/* <p className='mt-3'>Use =SheetAI()</p>
                            <p className='mt-3' style={{ fontSize: "13px" }}>get started with 3000 you can always upgrade later</p> */}
            </div>
            <WhatsIncluded list={Plans.hobby.features} />
          </div>
          <div className="divide-y bg-white rounded-lg border">
            <div className="p-6">
              <div className="flex items-center">
                <h2 className="text-lg uppercase font-medium leading-6 text-gray-900">{`Domain License`}</h2>
                {/* <span className='font-medium mx-2 px-2 py-1 bg-green-300 rounded-full'>24% OFF</span> */}
              </div>
              <p className="my-4 text-4xl font-bold tracking-tight text-gray-900">
                {country == "in" ? `₹` : `$`}
                <span id="basicPlanPrice">
                  {country == "in" ? `24,769` : `299`}
                </span>
                <span className="text-base font-medium text-gray-500ml-1 ml-1">
                  /year
                </span>
              </p>
              <SubscribeNowBtn
                onClick={() => {
                  // checkout("domain", true);
                }}
                label={`Subscribe to Unlimited Yearly`}
              />
              <a
                href="https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-4ER489906R992025PMP5ZLLY"
                className="mt-3 block w-full rounded-md border border-gray-100 bg-white py-2 text-center text-sm font-semibold text-gray-800 hover:bg-gray-100"
              >
                Pay with Paypal
              </a>
              <p className="text-sm mt-3 text-gray-600">
                SecondBrain.fyi for everyone in your organization. Recommended for
                schools and businesses.
              </p>
            </div>
            <WhatsIncluded list={Plans.pro.features} />
          </div>
        </div>

        {/* <div className="mt-16 relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md mx-auto lg:max-w-5xl">
                        <div className="absolute inset-x-0 top-0 transform translate-y-px">
                            <div className="flex justify-center transform -translate-y-1/2">
                                <span className="inline-flex rounded-full bg-teal-600 px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white">Domain License @ $299 /year</span>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white px-6 py-8 sm:p-10 lg:flex lg:items-center  border border-teal-600">
                            <div className="flex-1">
                                <div className="mt-4 text-lg leading-7 text-gray-600">Purchase a domain license and enable premium features for everyone in your organization. Recommended for schools and businesses.<p className="mt-2 text-base text-gray-500">Compatible with all&nbsp;<strong className="font-semibold">Google Workspace domains</strong>.</p></div></div><div className="mt-6 rounded-md shadow lg:mt-0 lg:ml-10 lg:flex-shrink-0 ">
                                <button onClick={() => { checkout('domain', true); }} className="w-full flex items-center justify-center px-5 py-3 text-base leading-6 font-medium rounded-md text-white bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out">Buy Domain License</button>
                            </div>
                        </div>
                    </div>
                </div> */}
        <p className="text-sm text-gray-500 mt-4">
          *For more than 20 users, please contact us at{" "}
          <a href="mailto:support@secondbrain.fyi" className="underline">
            support@secondbrain.fyi
          </a>{" "}
        </p>
      </div>
    </div>
  );
}

import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../helper/server";
import { domain } from "../../utils";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const getLocationDetails = async (ip: string) => {
  let countryCode = "NON-IN";
  let locationDetails = {};

  if (ip === "127.0.0.1") return { countryCode, locationDetails };

  try {
    const ipResp = await fetch(`http://ip-api.com/json/${ip}`);
    const ipRespJson = await ipResp.json();

    console.log({ ipRespJson });

    const { countryCode: cc, country, city, regionName, lat, lon } = ipRespJson;

    locationDetails = { country, city, regionName, lat, lon };
    countryCode = cc && cc.toUpperCase();
  } catch (e) {
    console.log("Location details fetch failed", e);
  }

  return { countryCode, locationDetails };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse<any> | undefined> => {
  if (req.method !== "POST") return res.status(405).end();
  const {
    plan = "basic",
    isyearly = false,
    rewardFulId = "",
  } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  const ip = (req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress) as string;
  const { countryCode, locationDetails } = await getLocationDetails(ip);

  const { id: sessionId } = rewardFulId
    ? await stripe.checkout.sessions.create({
        billing_address_collection: "required",
        metadata: {
          ip,
          ...locationDetails,
        },
        line_items: [
          {
            price:
              countryCode === "IN"
                ? process.env[
                    `IN_${plan.toUpperCase()}_${
                      isyearly ? "YEARLY" : "MONTHLY"
                    }_PRICEID`
                  ]
                : process.env[
                    `NONIN_${plan.toUpperCase()}_${
                      isyearly ? "YEARLY" : "MONTHLY"
                    }_PRICEID`
                  ],
            quantity: 1,
            ...(countryCode === "IN"
              ? { tax_rates: [process.env.STRIPE_TAX_RATE as string] }
              : {}),
          },
        ],
        allow_promotion_codes: true,
        mode: "subscription",
        payment_method_types: ["card"],
        success_url: `${domain}/thankyou`,
        cancel_url: `${domain}/pricing`,
        client_reference_id: rewardFulId,
      })
    : await stripe.checkout.sessions.create({
        billing_address_collection: "required",
        metadata: {
          ip,
          ...locationDetails,
        },
        line_items: [
          {
            price:
              countryCode === "IN"
                ? process.env[
                    `IN_${plan.toUpperCase()}_${
                      isyearly ? "YEARLY" : "MONTHLY"
                    }_PRICEID`
                  ]
                : process.env[
                    `NONIN_${plan.toUpperCase()}_${
                      isyearly ? "YEARLY" : "MONTHLY"
                    }_PRICEID`
                  ],
            quantity: 1,
            ...(countryCode === "IN"
              ? { tax_rates: [process.env.STRIPE_TAX_RATE as string] }
              : {}),
          },
        ],
        allow_promotion_codes: true,
        mode: "subscription",
        payment_method_types: ["card"],
        success_url: `${domain}/thankyou`,
        cancel_url: `${domain}/pricing`,
      });

  res.status(200).send({ sessionId });
};

import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import pLimit from "p-limit";
import { supabase } from "@/utils/SupabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2022-11-15",
  maxNetworkRetries: 0,
});

async function fetchAllSubscriptions(
  stripe: Stripe,
  startingAfter?: string
): Promise<Stripe.Subscription[]> {
  const subscriptions = await stripe.subscriptions.list({
    limit: 100,
    starting_after: startingAfter,
  });

  if (subscriptions.has_more) {
    const nextSubscriptions = await fetchAllSubscriptions(
      stripe,
      subscriptions.data[subscriptions.data.length - 1].id
    );
    return [...subscriptions.data, ...nextSubscriptions];
  } else {
    return subscriptions.data;
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const subscriptions = await fetchAllSubscriptions(stripe);

      // Set a concurrency limit for API requests
      const concurrencyLimit = 5;
      const limit = pLimit(concurrencyLimit);

      // Fetch customer information for each subscription with rate limiting
      const customers = await Promise.all(
        subscriptions.map((subscription) =>
          limit(() =>
            stripe.customers.retrieve(subscription.customer as string)
          )
        )
      );

      const subscriptionData = subscriptions.map((subscription, index) => {
        const customer = customers[index] as Stripe.Customer;
        const subscriptionItem = subscription.items.data[0];
        const plan = subscriptionItem?.plan;
        // Access cancellation_details from the subscription's metadata
        const cancellation_details = (subscription as any).cancellation_details;

        return {
          created: subscription.created,
          email: customer.email,
          customer_id: subscription.customer,
          subscription_id: subscription.id,
          billing_cycle_anchor: subscription.billing_cycle_anchor,
          cancel_at: subscription.cancel_at,
          cancellation_details: cancellation_details, // Assuming cancellation details are stored in metadata
          currency: plan?.currency,
          start_date: subscription.start_date,
          end_date: subscription.current_period_end,
          status: subscription.status,
          plan_id: plan?.id,
        };
      });

      // Upsert subscription data to Supabase table
      const { error } = await supabase
        .from("stripe_subscriptions")
        .upsert(subscriptionData, { onConflict: "id" });

      if (error) {
        console.error(
          "Error updating subscriptions data to Supabase:",
          error.message
        );
        res.status(500).json({
          error: `Failed to update subscriptions data to Supabase: ${error.message}`,
        });
      } else {
        res.status(200).json({
          message: "Subscriptions data successfully updated to Supabase",
        });
      }
    } catch (error) {
      console.error(
        "Error updating subscriptions data to Supabase:",
        error.message
      );
      res.status(500).json({
        error: `Failed to update subscriptions data to Supabase: ${error.message}`,
      });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;

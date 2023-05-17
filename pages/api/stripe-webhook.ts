import { NextApiRequest, NextApiResponse } from "next";
import { LogSnag } from "logsnag";
import { supabase } from "@/utils/SupabaseClient";

// "invoice.payment_succeeded" - to track subscription payments

// "invoice.payment_failed" - to send failed payment emails

// "customer.subscription.deleted" and "customer.subscription.updated" - to cancel canceled or failed payment subscriptions

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.body) {
    let event = request.body;
    console.log(`event.type: ${event["type"]}`);
    try {
      // Handle the event
      switch (event["type"]) {
        case "invoice.payment_succeeded":
          var invoice = event["data"]["object"];
          await handlePaymentComplete(invoice);
          break;
        case "invoice.payment_failed":
          var invoice = event["data"]["object"];
          await handlePaymentFailed(invoice);
        case "customer.subscription.deleted":
          var subscription = event["data"]["object"];
          await handleSubscriptionDeleted(subscription);
          break;
        case "customer.subscription.updated":
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
          response.status(400).send({
            error: true,
            message: `error.message: Unhandled event type`,
          });
      }
    } catch (error) {
      response.status(400).send({
        error: true,
        message: `error.message: ${error.toString()}`,
      });
    }
  } else {
    response.status(400).send({
      error: true,
      message: `error.message: No request body`,
    });
  }

  const updatePlan = async (planName: string, email: string) => {
    const { data, error } = await supabase
      .from("users")
      .update({ plan_name: planName })
      .eq("email", email);

    return { data, error };
  };

  const addToMailerlite = async (
    email: string,
    groupId: string
  ): Promise<{ mailerlite_error: boolean; message: string }> => {
    try {
      // -=-=-=-=-=-=- Add Email to Mailerlite to group no-account-upgrade
      const MailerLite = require("mailerlite-api-v2-node").default;
      var apiKey = process.env.MAILERLITE_API_KEY;
      const mailerLite = MailerLite(`${apiKey}`);
      console.log(
        `${email} Mail added to group by ${apiKey} to group ${groupId}`
      );
      await mailerLite.addSubscriberToGroup(groupId, {
        email: email,
      });
      console.log(`Mailerlite addSubscriberToGroup success`);
      return {
        mailerlite_error: false,
        message: `Mailerlite addSubscriberToGroup success`,
      };
    } catch (error) {
      console.log(`error: ${error}`);
      return {
        mailerlite_error: true,
        message: `addToMailerlite error.message: ${error.toString()}`,
      };
    }
  };

  async function handlePaymentComplete(invoice: any) {
    try {
      const customerData = {
        email: invoice["customer_email"].toLowerCase(),
        name: invoice["customer_name"],
        invoice_pdf: invoice["invoice_pdf"],
      };
      const priceId = invoice["lines"]["data"][0]["price"]["id"];
      // set user plan based on priceId
      switch (priceId) {
        // hobby plan
        case "price_1MqdfBSBADkGxXdlXARAOt2t": // PRICE ₹16,355.00 / year
        case "price_1MqdeoSBADkGxXdl59BBz37L": // IN Monthly ₹1,642.00 / month
        case "price_1Mqcz1SBADkGxXdlrHdd7Mgw": // NONIN Annual $199 / year
        case "price_1MqdfBSBADkGxXdlXARAOt2t": // NONIN Monthly $19.99 / month
          var { data, error } = await updatePlan(
            "hobby",
            customerData["email"]
          );

          if (error) {
            console.log(`error: ${error}`);
            response.status(400).send({
              error: true,
              message: `error.message: ${error.toString()}`,
            });
          }
          break;
        // Power Plan
        case "price_1MsjrSSBADkGxXdl1C6DtOnw": // IN YEARLY ₹40,000 / year
        case "price_1MsjqmSBADkGxXdlnuyrRdAT": // NONIN Monthly $49 / month
        case "price_1MsjqmSBADkGxXdlP6XfwF3D": // IN Monthly ₹4,035 / month
        case "price_1MsjqmSBADkGxXdlcARzPz24": // NONIN Yearly $490 / year
          var { data, error } = await updatePlan(
            "power",
            customerData["email"]
          );

          if (error) {
            console.log(`error: ${error}`);
            response.status(400).send({
              error: true,
              message: `error.message: ${error.toString()}`,
            });
          }

          break;
        // Pro Plan
        case "price_1MqdgXSBADkGxXdl9hJR2X0P": // PRICE ₹81,366.00 / year
        case "price_1MqdgHSBADkGxXdl8GPQbgL4": // IN Monthly ₹8,136.00 / month
        case "price_1Mqd0lSBADkGxXdlFUBlDFhL": // NONIN Annual $990 / year
        case "price_1Mqd0lSBADkGxXdldWDOqPDp": // NONIN Monthly $99.00 / month
          var { data, error } = await updatePlan("pro", customerData["email"]);

          if (error) {
            console.log(`error: ${error}`);
            response.status(400).send({
              error: true,
              message: `error.message: ${error.toString()}`,
            });
          }

          break;
        // Enterprise Plan
        case "price_1MqdlBSBADkGxXdl0esnzuJg": // IN monthly PRICE ₹41,011.00 / month
        case "price_1Mqd1OSBADkGxXdlXeUGSzIr": // NONIN monthly PRICE $499.00 / month
          var { data, error } = await updatePlan(
            "enterprise",
            customerData["email"]
          );

          if (error) {
            console.log(`error: ${error}`);
            response.status(400).send({
              error: true,
              message: `error.message: ${error.toString()}`,
            });
          }
          break;
        default:
          response.status(400).send({
            error: true,
            message: `error.message: priceId: ${priceId} not found`,
          });
          break;
      }

      // add email to Mailerlite Paying user for Email
      var { mailerlite_error, message } = await addToMailerlite(
        customerData["email"],
        process.env.MAILERLITE_PAYINGUSER_GROUP_ID
      );

      if (mailerlite_error) {
        console.log(`error: ${error}`);
        response.status(400).send({
          error: true,
          message: `mailerlite_error error.message: ${error.toString()}`,
        });
      }

      response.status(200).send({
        error: false,
        message: `success`,
      });

      console.log(`customerData: ${JSON.stringify(customerData)}`);
      // -=-=-=-=-=-=- intialise firebase
      const fs = require("firebase-admin");
      const serviceAccount = require("../../lib/sheetai-firestore-api.json");
      if (!fs.apps.length) {
        fs.initializeApp({
          credential: fs.credential.cert(serviceAccount),
        });
      }
      // -=-=-=-=-=-=- update user plan to boss
      const db = fs.firestore();
      const usersRef = await db.collection("users");
      const userQuery = await usersRef.where(
        "email",
        "==",
        customerData["email"]
      );
      // update user plan to boss
      const userQuerySnapshot = await userQuery.get();
      if (userQuerySnapshot.empty) {
        console.log("No matching documents.");
        // -=-=-=-=-=-=- Add Email to Mailerlite to group no-account-upgrade
        const MailerLite = require("mailerlite-api-v2-node").default;
        var apiKey = process.env.MAILERLITE_API_KEY;
        var groupId = process.env.MAILERLITE_NO_ACCOUNT_UPGRADE_GROUP_ID;
        const mailerLite = MailerLite(`${apiKey}`);
        console.log(
          `${invoice["customer_email"]} Mail added to group by ${apiKey} to group ${groupId}`
        );
        await mailerLite.addSubscriberToGroup(groupId, {
          email: invoice["customer_email"],
          Name: invoice["customer_name"],
        });
        // --------------------
      } else {
        userQuerySnapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          usersRef.doc(doc.id).update({
            plan: customerData["plan"],
          });
        });

        // -=-=-=-=-=-=- Add Email to Mailerlite to group no-account-upgrade
        const MailerLite = require("mailerlite-api-v2-node").default;
        var apiKey = process.env.MAILERLITE_API_KEY;
        var groupId = process.env.MAILERLITE_SUBSCRIPTION_CREATED_GROUP_ID;
        const mailerLite = MailerLite(`${apiKey}`);
        console.log(
          `${invoice["customer_email"]} Mail added to group by ${apiKey} to group ${groupId}`
        );
        await mailerLite.addSubscriberToGroup(groupId, {
          email: invoice["customer_email"],
          Name: invoice["customer_name"],
        });
        // --------------------
      }
      // -=-=-=-=-=-=- initialise logsnag
      var logsnag: LogSnag = new LogSnag({
        token: "cd83d4ee36fee704b9d05a8365627a7b",
        project: "sheet-ai",
      });
      await logsnag.publish({
        channel: "bought",
        event: "New Payment",
        description: `email:${customerData["email"]}`,
        icon: "💵",
        tags: {
          email: customerData["email"],
        },
        notify: true,
      });
      response.status(200).send({
        error: false,
        message: `success`,
      });
    } catch (error) {
      response.status(400).send({
        error: true,
        message: `error.message: ${error.toString()}`,
      });
    }
  }

  async function handlePaymentFailed(invoice: any) {
    try {
      // get user email from payment failed stripe invoice and add to mailerlite
      // -=-=-=-=-=-=- Add Email to Mailerlite
      const MailerLite = require("mailerlite-api-v2-node").default;
      var apiKey = process.env.MAILERLITE_API_KEY;
      var groupId = process.env.MAILERLITE_PAYMENT_FAILED_GROUP_ID;
      const mailerLite = MailerLite(`${apiKey}`);
      console.log(
        `${invoice["customer_email"]} Mail added to group by ${apiKey} to group ${groupId}`
      );
      await mailerLite.addSubscriberToGroup(groupId, {
        email: invoice["customer_email"],
        Name: invoice["customer_name"],
      });
      // -=-=-=-=-=-=- initialise logsnag
      var logsnag: LogSnag = new LogSnag({
        token: "cd83d4ee36fee704b9d05a8365627a7b",
        project: "sheet-ai",
      });
      await logsnag.publish({
        channel: "payment-failed",
        event: "Payment Failed",
        description: `email:${invoice["customer_email"]}`,
        icon: "🛑",
        tags: {
          email: invoice["customer_email"],
        },
        notify: true,
      });

      response.status(200).send({
        error: false,
        message: `success`,
      });
    } catch (error) {
      console.log(error);
      response.status(400).send({
        error: true,
        message: `error.message: ${error.toString()}`,
      });
    }
  }

  async function handleSubscriptionDeleted(invoice: any) {
    try {
      // update user plan to free firestore
      // -=-=-=-=-=-=- intialise firebase
      const fs = require("firebase-admin");
      const serviceAccount = require("../../lib/sheetai-firestore-api.json");
      if (!fs.apps.length) {
        fs.initializeApp({
          credential: fs.credential.cert(serviceAccount),
        });
      }
      // -=-=-=-=-=-=- update user plan to free
      const db = fs.firestore();
      const usersRef = await db.collection("users");
      const userQuery = await usersRef.where(
        "email",
        "==",
        invoice["customer_email"]
      );
      // update user plan to free
      const userQuerySnapshot = await userQuery.get();
      if (userQuerySnapshot.empty) {
        console.log("No matching documents.");
      } else {
        userQuerySnapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          usersRef.doc(doc.id).update({
            plan: "free",
          });
        });
      }
      // -=-=-=-=-=-=- initialise logsnag
      var logsnag: LogSnag = new LogSnag({
        token: "cd83d4ee36fee704b9d05a8365627a7b",
        project: "sheet-ai",
      });
      await logsnag.publish({
        channel: "subscription-cancelled",
        event: "Subscription Cancelled",
        description: `email:${invoice["customer_email"]}`,
        icon: "🔻",
        tags: {
          email: invoice["customer_email"],
        },
        notify: true,
      });
      // add email to mailerlite in subscription-cancelled
      // -=-=-=-=-=-=- Add Email to Mailerlite to group no-account-upgrade
      const MailerLite = require("mailerlite-api-v2-node").default;
      var apiKey = process.env.MAILERLITE_API_KEY;
      var groupId = process.env.MAILERLITE_SUBSCRIPTION_CANCELLED_GROUP_ID;
      const mailerLite = MailerLite(`${apiKey}`);
      console.log(
        `${invoice["customer_email"]} Mail added to group by ${apiKey} to group ${groupId}`
      );
      await mailerLite.addSubscriberToGroup(groupId, {
        email: invoice["customer_email"],
        Name: invoice["customer_name"],
      });
      // --------------------
      response.status(200).send({
        error: false,
        message: `success`,
      });
    } catch (error) {
      console.log(error);
      response.status(400).send({
        error: true,
        message: `error.message: ${error.toString()}`,
      });
    }
  }
}

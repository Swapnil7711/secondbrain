import { NextApiRequest, NextApiResponse } from "next";
import MailerLite from "mailerlite-api-v2-node";

const mailerLite = MailerLite(process.env.MAILERLITE_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, groupName } = req.body;

  if (!email || !groupName) {
    res.status(400).json({ error: "email and groupId are required" });
    return;
  }

  try {
    switch (groupName) {
      case "signed-up":
        var groupId: number = parseInt(
          process.env.MAILERLITE_SIGNEDUP_GROUP_ID
        );
        console.log(
          "groupId: ",
          groupId +
            "email: " +
            email +
            "apiKey: " +
            process.env.MAILERLITE_API_KEY
        );
        await mailerLite.addSubscriberToGroup(groupId, { email: email });
        break;
      default:
        res.status(400).json({ error: "Invalid group name" });
        break;
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error adding email to group:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to add email to group" });
  }
}

export function ValidateEmail(email: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}

export function showSnackbar(message: string) {
  // Get the snackbar DIV
  var x = document.getElementById("secondbrain__snackbar");
  // Add the "show" class to DIV
  if (!x) return;
  x.innerText = `${message}`;
  x.className = "show";
  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    if (!x) return;
    x.className = x.className.replace("show", "");
  }, 3000);
}

export function timeAgo(timestamp) {
  const now = new Date();
  const timeDifference = now.getTime() - new Date(timestamp).getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years > 1 ? `${years} years ago` : "1 year ago";
  } else if (months > 0) {
    return months > 1 ? `${months} months ago` : "1 month ago";
  } else if (days > 0) {
    return days > 1 ? `${days} days ago` : "1 day ago";
  } else if (hours > 0) {
    return hours > 1 ? `${hours} hours ago` : "1 hour ago";
  } else if (minutes > 0) {
    return minutes > 1 ? `${minutes} minutes ago` : "1 minute ago";
  } else {
    return seconds > 1 ? `${seconds} seconds ago` : "1 second ago";
  }
}

// get username from email
export function getUsernameFromEmail(email: string) {
  return email.split("@")[0];
}

// random string generator
export function randomString(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const domain = "https://www.secondbrain.fyi";

export async function searchDocuments(
  query_embedding: number[], // Make sure to provide the correct type for query_embedding
  match_count: number
): Promise<any> {
  try {
    const res = await fetch("/api/search-documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query_embedding, match_count }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch documents");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return null;
  }
}

export const generalFaqs = [
  {
    id: 1,
    question: "What on earth is SecondBrain.fyi?",
    answer:
      "SecondBrain.fyi is like your website's personal assistant. Just upload your data and it'll create a chatbot that can answer any question about your content. It's like training a puppy, but much easier and with fewer accidents",
  },
  {
    id: 2,
    question: "What kind of data can I upload to SecondBrain.fyi?",
    answer:
      "Whether you've got pdf files, text documents, or even a website, SecondBrain.fyi can work with it. It's not fussy. The more you feed it, the smarter it gets.",
  },
  {
    id: 3,
    question: "Can I customize my chatbots in SecondBrain.fyi?",
    answer:
      "Absolutely! You can make your chatbot as unique as you are. Give it a funky name, teach it to respond in French, or just make it super polite. It's your chatbot - you call the shots.",
  },
  {
    id: 4,
    question: "Where is my data stored in SecondBrain.fyi?",
    answer:
      "On secure servers, away from prying eyes. We take data security as seriously as a cat takes nap time.",
  },
  {
    id: 5,
    question: "Does SecondBrain.fyi use ChatGPT or GPT-4?",
    answer:
      "Both! It's like choosing between cake and ice cream. Tough, we know. But don't worry, you can switch between the two whenever you like.",
  },
  {
    id: 6,
    question: "How do I add my chatbot to my website using SecondBrain.fyi?",
    answer:
      "It's as easy as adding a funny cat video to your Facebook page. Just create your chatbot and click 'Embed on website'. Voila! Your website is now a chatty Cathy.",
  },
  {
    id: 7,
    question: "Does SecondBrain.fyi support multiple languages?",
    answer:
      "Oui, sí, ja, hai, yes! We support almost 95 languages. So no matter where your visitors are from, SecondBrain.fyi has got you covered.",
  },
  {
    id: 8,
    question: "Can I share a chatbot I created using SecondBrain.fyi?",
    answer:
      "Definitely! You can switch your chatbot to public and share it far and wide. It's like bragging about your pet, just without the fur on your clothes!",
  },
];

export const tallyFormID = `mBa221`;
export const appName = "secondbrain.fyi";
export const appEmail = "support@secondbrain.fyi";

const appEnvironment = process.env.NODE_ENV;
export const askAIbaseURL =
  appEnvironment === "production"
    ? "https://www.secondbrain.fyi/api/ask-ai"
    : "http://localhost:3000/api/ask-ai";

export const askAIStreamURL =
  appEnvironment === "production" ? "/api/ask-ai-stream" : "/api/ask-ai-stream";

export const searchDocumentsBaseURL =
  appEnvironment === "production"
    ? "https://www.secondbrain.fyi/api/search-documents"
    : "http://localhost:3000/api/search-documents";

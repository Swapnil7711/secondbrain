// pages/api/openai_api_call.ts
import axios from "axios";
import fetch from "node-fetch";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { searchDocumentsBaseURL } from "@/utils";
import { getBotInfo } from "@/supabase/tables";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const generateEmbeddings = async (text: string): Promise<number[]> => {
    console.log(`text:`, text);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/embeddings",
        {
          input: text,
          model: "text-embedding-ada-002",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );
      return response.data.data[0].embedding;
    } catch (error) {
      console.log("Error:");
      res.status(500).json({ error: "Server Error" });
    }
  };
  const searchDocuments = async (
    query_bot_id: string,
    query_embedding: number[],
    match_count: number
  ): Promise<any> => {
    console.log(`query_embedding:`, query_embedding);
    console.log(`match_count:`, match_count);
    console.log(`query_bot_id:`, query_bot_id);
    try {
      const res = await fetch(searchDocumentsBaseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query_embedding, match_count, query_bot_id }),
      });

      // if (!res.ok) {
      //   throw new Error("Failed to fetch documents");
      // }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return null;
    }
  };
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  // try {
  const { query, bot_id } = req.body;

  //check if bot_id is valid if not return
  if (!bot_id) {
    res.status(400).json({ error: "Invalid bot_id" });
    return;
  }
  var botInfo = await getBotInfo(bot_id);
  console.log(`botInfo:`, botInfo["data"][0]["name"]);

  if (botInfo === null) {
    res.status(400).json({ error: "Invalid bot_id" });
    return;
  }

  const chatContent = [
    // {
    //   role: "system",
    //   content:
    //     'I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given text. If the answer is not included in the text, say exactly "Hmm, I am not sure." and stop after that. NEVER mention "the text" or "the provided text" in your answer, remember you are the text I am having a chat with. Refuse to answer any question not about the text. Never break character.',
    // },
  ];

  chatContent.push({
    role: "user",
    content: botInfo["data"][0]["name"] + query,
  });
  console.log(`added chatContent:`, chatContent);
  console.log(`query:`, query);

  const embeddings = await generateEmbeddings(query);
  console.log(`embeddings:`, embeddings.toString());

  // now call searchDocuments
  const searchResults = await searchDocuments(bot_id, embeddings, 3);
  console.log(`searchResults:`, searchResults);
  //   if search results is empty then retur

  function formatString(str) {
    let formattedString = str
      .replace(/\\n/g, "\n") // Replace '\n' with actual line breaks
      .replace(/'\s*\+\s*'/g, "") // Remove '+' along with surrounding quotes and spaces
      .replace(/^`+|`+$/g, "") // Remove starting and ending backticks (`)
      .replace(/^-+$/gm, "") // Remove lines containing only hyphens
      .replace(/\n{2,}/g, "\n") // Replace multiple line breaks with a single one
      .trim(); // Remove any leading or trailing whitespace
    return formattedString;
  }
  // search results is string array so make a string out of it
  let contextString = "";
  if (searchResults !== null && searchResults?.length !== 0) {
    for (let index = 0; index < searchResults.length; index++) {
      contextString =
        contextString + formatString(searchResults[index].content) + " ";
    }
  }
  console.log(`contextString:`, contextString);

  // if contextString is empty then return "Hmm, I'm not sure send email to support@secondbrain.fyi
  //   if (contextString === "") {
  //     res.status(200).json({
  //       answer: "Hmm, I'm not sure send email to support@secondbrain.fyi",
  //       contextString: contextString,
  //       prompt: query,
  //     });
  //   }

  // create prompt with the results
  // const prompt = `You are an Helpful AI assistant. You are given the following extracted parts of a long document and a question and chat. Provide a conversational answer based on the context provided.
  // You should only use hyperlinks as references that are explicitly listed as a source in the context below. Do NOT make up a hyperlink that is not listed below.
  // If you can't find the answer in the context below, just say "Hmm, I'm not sure send email to support@secondbrain.fyi" Don't try to make up an answer.
  // Choose the most relevant link that matches the context provided:
  // =========
  // ${contextString}
  // =========
  // Question: ${query}
  // Answer in Markdown:`;
  // console.log(`prompt:`, prompt);

  var prompt;
  if (contextString === "") {
    prompt = query;
  } else {
    prompt = `answer question based on context provided.
    **Context:**
    ${contextString}
    
    **Question:**
    ${query}
    
    **Answer:**
    `;
  }
  console.log(`prompt:`, prompt);
  // overrise the user content with the prompt
  chatContent[chatContent?.length - 1].content = prompt;
  console.log(`chatContent:`, chatContent);

  // make a call to openai chat completion
  const openAIChatEndpoint = "https://api.openai.com/v1/chat/completions";
  const payload = {
    model: "gpt-3.5-turbo",
    messages: chatContent,
  };
  console.log(`payload:`, payload);

  (async () => {
    try {
      const response = await fetch(openAIChatEndpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
          "Content-Type": "application/json",
        },
      });
      const responseData: any = await response.json();
      console.log(`response:`, responseData);

      // get the answer from the response
      const answerLocal = responseData.choices[0].message.content;
      console.log(`answerLocal:`, answerLocal);
      res.status(200).json({
        answer: answerLocal,
        contextString: contextString,
        prompt: prompt,
      });
    } catch (error) {
      console.error(`Error:`, error);
      res.status(500).json({ error: "Server Error" });
    }
  })();
};

export default handler;

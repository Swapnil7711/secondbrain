// pages/api/openai_api_call.ts
import axios from "axios";
import fetch from "node-fetch";
import type { NextApiRequest, NextApiResponse } from "next";
import { searchDocumentsBaseURL } from "@/utils";
import { OpenAIStream, OpenAIStreamPayload } from "@/utils/OpenAIStream";

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const generateEmbeddings = async (text: string): Promise<number[]> => {
  console.log(`text:`, text);
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-ada-002",
      }),
    });

    // Check if the response is successful (status code 2xx)
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.log("Error:", error);
    return null;
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

const handler = async (req: Request) => {
  const { chatContent, bot_id } = (await req.json()) as {
    chatContent?: any;
    bot_id?: any;
  };

  console.log(`chatContent:`, chatContent);
  // get the user last message from the chatContent
  const query = chatContent[chatContent?.length - 1].content; // this have to be from user.
  console.log(`query:`, query);

  const embeddings = await generateEmbeddings(query);
  console.log(`embeddings:`, embeddings.toString());

  // now call searchDocuments
  const searchResults = await searchDocuments(bot_id, embeddings, 10);
  console.log(`searchResults:`, searchResults);

  // search results is string array so make a string out of it
  let contextString = "";
  if (searchResults !== null && searchResults?.length !== 0) {
    for (let index = 0; index < searchResults.length; index++) {
      contextString =
        contextString + formatString(searchResults[index].content) + " ";
    }
  }
  console.log(`contextString:`, contextString);

  const prompt = `answer question based on context provided.
      **Context:**
      ${contextString}
      
      **Question:**
      ${query}
      
      **Answer:**
      `;
  console.log(`prompt:`, prompt);
  // overrise the user content with the prompt
  chatContent[chatContent?.length - 1].content = prompt;
  console.log(`chatContent:`, chatContent);

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: chatContent,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 400,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;

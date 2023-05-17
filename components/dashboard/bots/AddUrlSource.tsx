import { showSnackbar } from "@/utils";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/utils/SupabaseClient";
import { useState } from "react";
import axios from 'axios';

export default function AddURLSource({ hideAddSourceOptions, customer, botInfo }) {
    const [url, setUrl] = useState("");
    const [markdown, setMarkdown] = useState('');
    const [title, setTitle] = useState('');
    const [indexing, setindexing] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setindexing(true);
        var mdLocal = await scrapeWebsite(url);
        console.log(mdLocal);
        const chunks = chunkMarkdown(mdLocal);
        console.log(`Chunks: ${chunks.length} chunks: ${chunks[0]}`);
        var { success, source_id } = await addSourceToSupbase();
        if (!success) {
            console.log('Failed to add source to supabase');
            showSnackbar(`Indexing failed for ${url}.`);
            setindexing(false);
        }
        for (let index = 0; index < chunks.length; index++) {
            await generateEmbeddings(chunks[index]).then(async (embedding) => {
                if (embedding) {
                    await addInfoToSupabase(url, title, chunks[index], embedding, source_id);
                } else {
                    console.log('Embedding failed');
                    showSnackbar(`Indexing failed for ${url}.`);
                    setindexing(false);
                    return;
                }
            });
        }
        // if everything is successful, then update the source to be indexed
        await updateSourceToIndexed(url);
        setindexing(false);
        console.log(`Chunks: ${chunks.length} chunks: ${chunks}`);
    }

    const updateSourceToIndexed = async (url: string): Promise<any> => {
        try {
            // Insert the new row into the table
            const { data, error } = await supabase.from("sources").update({
                is_indexed: true,
            }).match({ url: url });
            if (error) throw error;
            console.log(`Updated source: ${url} to indexed.`);
            showSnackbar(`${url} is now indexed.`);
            hideAddSourceOptions();
            return true;
        } catch (error) {
            console.error('Error inserting row:', error);
            return false;
        }
    }

    const addSourceToSupbase = async (): Promise<any> => {
        try {
            var source_id = uuidv4();
            // Insert the new row into the table
            const { data, error } = await supabase.from("sources").insert({
                url: url,
                type: "URL",
                user_id: customer.user_id,
                bot_id: botInfo.bot_id,
                source_id: source_id,
                is_indexed: false,
            });
            if (error) throw error;
            console.log('Source added successfully.');
            return { success: true, source_id: source_id };

        } catch (error) {
            console.error('Error inserting row:', error);
            return { success: false, source_id: null };
        }
    }

    const addInfoToSupabase = async (source: string, title: string, markdown: string, embedding: number[], source_id): Promise<void> => {
        try {
            // Insert the new row into the table
            const { data, error } = await supabase.from("documents").insert({
                content: markdown,
                metadata: {
                    source: source,
                    contentLength: markdown.length,
                },
                embedding: embedding,
                user_id: customer.user_id,
                bot_id: botInfo.bot_id,
                source_id: source_id,
                source_url: source,
            });
            if (error) throw error;
            console.log('Row inserted successfully.');
        } catch (error) {
            console.error('Error inserting row:', error);
        }
    };

    const scrapeWebsite = async (url: string): Promise<string | null> => {
        try {
            const response = await fetch(`/api/scrape-web-cheerio?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error('Failed to scrape website');
            }
            const data = await response.json();
            console.log(`data:${data}`);
            return data.markdown;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const generateEmbeddings = async (text: string): Promise<number[]> => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/embeddings',
                {
                    input: text,
                    model: 'text-embedding-ada-002',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                    },
                },
            );
            console.log(`response.data.data[0].embedding:`, response.data.data[0].embedding);
            return response.data.data[0].embedding;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    function chunkMarkdown(markdownString: string, wordsPerChunk: number = 150): string[] {
        const paragraphs = markdownString.split(/\n\s*\n/); // Split markdown into individual paragraphs
        const chunks = [];
        let chunk = '';

        // Group paragraphs into chunks of 2-3 based on average word count
        for (let i = 0; i < paragraphs.length; i++) {
            const words = paragraphs[i].trim().split(/\s+/);

            if (chunk && words.length + chunk.split(/\s+/).length > wordsPerChunk) {
                chunks.push(chunk.trim());
                chunk = '';
            }

            chunk += paragraphs[i] + '\n\n';

            if (i === paragraphs.length - 1) {
                chunks.push(chunk.trim());
                console.log(`chunks:`, chunks);
            }
        }

        return chunks;
    }

    return (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="col mt-6 text-sm text-gray-600">
                <p className="text-md text-gray-500 mb-3 px-3">
                    Add the URL of a single webpage to learn from. This can be a blog
                    post, a news article, or any other page on the web. We will download
                    the page, parse the content, and add it to this knowledge base.
                </p>
            </div>
            <div className="col">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="flex justify-between">
                            <label
                                htmlFor="url"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Source URL
                            </label>
                            <span className="text-sm capitalize text-gray-500">required</span>
                        </div>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                                type="url"
                                name="url"
                                onChange={(e) => setUrl(e.target.value)}
                                id="url"
                                className="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                                placeholder="https://example.com/page/"
                                aria-describedby="url-description"
                            />
                        </div>
                        {/* checkbox with label "Fetch Upto 25 Pages from the same domain" */}
                        {/* <div className="mt-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="fetch-upto-25-pages"
                      name="fetch-upto-25-pages"
                      type="checkbox"
                      className="focus:ring-gray-500 h-4 w-4 text-gray-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="fetch-upto-25-pages"
                      className=" text-gray-500"
                    >
                      Fetch Upto 25 Pages from the same domain (helps get more info hence provide more and better responses)
                    </label>
                  </div>
                </div>
              </div> */}
                    </div>
                    <div className="mb-4">
                        <div className="flex justify-between">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Source title
                            </label>
                            <span className="text-sm capitalize text-gray-500">optional</span>
                        </div>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="title"
                                onChange={(e) => setTitle(e.target.value)}
                                id="title"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                                aria-describedby="title-description"
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500" id="title-description">
                            Title of source displayed alongside answers. Defaults to page title
                            or file name.
                        </p>
                    </div>
                    <div className="mt-6 mb-2 flex flex-shrink-0 items-end justify-end">
                        <button
                            type="button"
                            onClick={(e) => {
                                hideAddSourceOptions();
                            }}
                            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-75"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="-ml-1 mr-2 h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            {indexing ? "Indexing..." : "Add source"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react'
import axios from 'axios';
import { askAIbaseURL, searchDocuments, showSnackbar } from "@/utils";
import ChatWindow from '@/components/global/ChatWindow';
import { supabase } from '@/utils/SupabaseClient';

export default function ChatWithBot() {

    const chatContent = [
        {
            role: 'system',
            content: 'I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given text. If the answer is not included in the text, say exactly "Hmm, I am not sure." and stop after that. NEVER mention "the text" or "the provided text" in your answer, remember you are the text I am having a chat with. Refuse to answer any question not about the text. Never break character.',
        },
        {
            role: 'assistant',
            content: 'Hello, I am AI Assistant. Ask me anything.'
        }
    ];

    const [content, setContent] = useState(chatContent);
    const router = useRouter();
    const { botId } = router.query as { botId: string };
    const [loadingAnswer, setloadingAnswer] = useState(false);
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [customerQuery, setcustomerQuery] = useState("");
    const inputRef = useRef(null);

    const generateEmbeddings = async (text: string): Promise<number[]> => {
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
        return response.data.data[0].embedding;
    };

    const getAnswer = async () => {
        setAnswer("");
        setloadingAnswer(true);
        // check if question is empty or not
        if (query == "") {
            setloadingAnswer(false);
            showSnackbar("Please enter a question");
            return;
        }
        // call openAI embedding function 
        var embeddings = await generateEmbeddings(query);
        console.log(`embeddings:`, embeddings);
        // now call searchDocuments
        var searchResults = await searchDocuments(embeddings, 3);
        console.log(`searchResults:`, searchResults);
        // search results is string array so make a string out of it
        var contextString = "";
        for (let index = 0; index < searchResults.length; index++) {
            contextString = contextString + searchResults[index].content + " ";
        }

        // create prompt with the results 
        var prompt = `You are an Helpful AI assistant. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
        You should only use hyperlinks as references that are explicitly listed as a source in the context below. Do NOT make up a hyperlink that is not listed below.
        If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
        Choose the most relevant link that matches the context provided:
        =========
        ${contextString}
        =========
        Question: ${query}
        Answer in Markdown: `
        console.log(`prompt:`, prompt);
        // make a call to openai chat completion
        const openAIChatEndpoint = "https://api.openai.com/v1/chat/completions";
        var payload = {
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "user", "content": prompt },
            ],
            temperature: 0,
            max_tokens: 400,
        }
        var response = await axios.post(openAIChatEndpoint, payload, {
            headers: { Authorization: "Bearer " + process.env.NEXT_PUBLIC_OPENAI_API_KEY },
        });
        console.log(`response:`, response);
        // get the answer from the response
        var answerLocal = response.data.choices[0].message.content;
        console.log(`answerLocal:`, answerLocal);
        // set the answer in the state
        setAnswer(answerLocal);
        setloadingAnswer(false);
    }

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    async function addQnA(question, answer) {
        console.log('Adding QnA:', botId, question, answer);
        try {
            const response = await fetch('https://www.secondbrain.fyi/api/add-qna', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bot_id: botId, question: question, answer: answer }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const { data } = await response.json();
            console.log('QnA added successfully:', data);
        } catch (error) {
            console.error('Error adding QnA:', error.message);
        }
    }

    function askAI() {
        var customerQueryLocal = inputRef.current.value;;
        setcustomerQuery("");
        setContent([
            ...content,
            {
                role: 'user',
                content: customerQueryLocal,
            },
        ]);
        // make a call to ask-ai api with the content messages
        fetch(askAIbaseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({
                chatContent: [
                    ...content,
                    {
                        role: 'user',
                        content: customerQueryLocal,
                    },
                ], bot_id: botId
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Answer:', data.answer + "contextString" + data.contextString + `prompt: ${data.prompt}`);
                // add answer to chat
                if (data.answer) {
                    setContent(prevChatContent => [
                        ...prevChatContent,
                        {
                            role: 'assistant',
                            content: data.answer
                        }
                    ]);
                }
                // add Q&A to database
                if (customerQueryLocal && data.answer) {
                    addQnA(customerQueryLocal, data.answer);
                }
                // hide thinking
                document.getElementById("ai-thinking").style.display = "none";
            })
            .catch((error) => {
                console.error('Error:', error);
                showSnackbar("Something went wrong. Please try again later.")
            });
        inputRef.current.value = ""; // Clear the input field
    }

    return (
        <div className="bg-white w-full py-4">
            {/* <h2 className="text-3xl font-bold my-4">Blurweb App AI Support</h2>
            <p className="mb-6">Ask me anything</p>
            <div>
                <form className='mt-2 flex items-center mx-auto justify-center rounded-md max-w-xl' onSubmit={(e) => { e.preventDefault(); getAnswer() }}>
                    <input
                        type="text"
                        placeholder="Ask a question"
                        className='px-4 py-4 w-full rounded-md shadow-sm border border-gray-300'
                        value={query}
                        onChange={handleInputChange}
                    />
                    <button type='submit' className="ml-2 shadow hover:shadow-sm text-white rounded-md p-4 border border-gray-300 bg-gray-800 hover:bg-gray-900">
                        {loadingAnswer ? 'Thinking...' : "Ask"}
                    </button>
                </form>
                {
                    answer !== "" && !loadingAnswer && <div className="flex mt-6 mx-auto max-w-xl justify-center">
                        <img className='w-12 h-12 rounded-full p-2 border' src="/assets/logo.svg" alt="profile" />
                        <div className="ml-2 bg-gray-200 rounded-md rounded-tl-none p-4 text-left border-2">
                            {answer}
                        </div>
                    </div>
                }
            </div > */}
            {/* set max height to be 90% of screen */}
            <ChatWindow classNames='mx-4 sm:m-auto bg-white max-h-screen'
                botid={botId} isEmbed={true} />
            {/* <div className="m-auto bg-white mt-10 border p-3 rounded-md max-w-3xl h-[36rem] flex flex-col justify-between">
                <div>
                    {content.slice(1).map((message, index) => (
                        <div key={index} className={`float-${message.role === 'user' ? 'right justify-end' : 'left justify-start'} flex clear-both ${message.role === 'user' ? 'ml-8' : 'mr-8'}`}>
                            <div
                                className={`float-${message.role === 'user' ? 'right' : 'left'} mb-2 overflow-auto rounded-lg py-3 px-4 inline-block max-w-full`}
                                style={{
                                    backgroundColor: message.role === 'user' ? 'rgb(59, 129, 246)' : 'rgb(244, 244, 245)',
                                    color: message.role === 'user' ? 'white' : 'black',
                                }}
                            >
                                <div className="flex space-x-3">
                                    <div className="flex-1 gap-4">
                                        <div className="prose text-inherit text-sm">
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                    }
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    askAI();
                }} id="secondbrain.fyi-message_form" className="" style={{ marginTop: '12px', display: 'flex', width: '100%', border: '1px solid lightgray', borderRadius: '4px' }}>
                    <input
                        ref={inputRef}
                        id="secondbrain.fyi-input" style={{ fontSize: "14px", width: '100%', border: 'none', padding: '12px', borderRadius: '4px', outline: 'none', fontFamily: 'Plus Jakarta Sans' }} />
                    <button id="secondbrain.fyi-send" style={{ border: 'none', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <svg style={{ height: '20px', width: '20px', marginRight: '6px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </form>
            </div > */}
        </div >
    )
}

export async function getServerSideProps(context) {
    const { botId } = context.params;

    let { data, error } = await supabase
        .from('bots')
        .select('bot_id')
        .eq('bot_id', botId)
        .single();

    if (error || !data) {
        return {
            notFound: true,
        }
    }

    return {
        props: {}, // will be passed to the page component as props
    }
}

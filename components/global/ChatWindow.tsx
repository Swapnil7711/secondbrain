import { UserContext } from '@/contexts/user-context';
import { fetchBotQuestionCount, getBotInfo } from '@/supabase/tables';
import { askAIStreamURL, askAIbaseURL, showSnackbar } from '@/utils';
import React, { useContext, useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'

const chatContent = [
    {
        role: 'system',
        content: 'You are enthusiatic representative. Given the following sections, answer the question using only that information, outputted in markdown format. If the answer is not included in the text, say exactly "Hmm, I am not sure." and stop after that. NEVER mention "the text" or "the provided text" in your answer. Refuse to answer any question not about the text. Never break character.',
    }
];
export default function ChatWindow({ classNames, botid, isEmbed }: { classNames?: string, botid: string, isEmbed: boolean }) {

    const [content, setContent] = useState(chatContent);
    const [loading, setloading] = useState(false);
    const [botQuestionCount, setbotQuestionCount] = useState(0);
    const [customer, setCustomer] = useContext(UserContext).customer;
    const [customerQuery, setcustomerQuery] = useState("");
    const [gettingBotInfo, setgettingBotInfo] = useState(true);
    const [botInfo, setBotInfo] = useState(null);

    const [streaming, setstreaming] = useState(false);
    const [streamingText, setstreamingText] = useState("");

    const chatContainerRef = useRef(null);

    var botInfoLocal;
    async function getBotInfoSupabase() {
        setgettingBotInfo(true)
        botInfoLocal = await getBotInfo(botid);
        setgettingBotInfo(false)
        setBotInfo(botInfoLocal.data[0]);
        // setinitialMessage(botInfoLocal.data[0].initial_message);
        // add initial message to chatContent role assistant and content initial_message
        // only add if not already present
        console.log(`botInfoLocal:`, botInfoLocal);
        if (content.length === 1) {
            setContent([
                ...content,
                {
                    role: 'assistant',
                    content: botInfoLocal.data[0]?.initial_message ? botInfoLocal.data[0].initial_message : "Hi, I am your AI assistant. Ask me anything"
                },
            ]);
        }

    }

    async function fetchBotQuestionCountFromSupabase() {
        console.log("fetchBotQuestionCountFromSupabase");
        console.log(`fetchBotQuestionCountFromSupabase userInfo.user_id:`, customer?.user_id + `botid: ${botid}`);
        var count = await fetchBotQuestionCount(customer?.user_id, botid);
        console.log(`count: ${count}`);
        // now based on customer.plan set the botQuestionCount to be limit - count
        if (customer?.plan === "free") {
            setbotQuestionCount(50 - count);
        } else if (customer?.plan === "hobby") {
            setbotQuestionCount(1000 - count);
        } else if (customer?.plan === "power") {
            setbotQuestionCount(5000 - count);
        } else if (customer?.plan === "pro") {
            setbotQuestionCount(10000 - count);
        } else if (customer?.plan === "enterprise") {
            setbotQuestionCount(12000 - count);
        }
    }

    async function askAI() {
        setloading(true);
        var customerQueryLocal = customerQuery;
        setContent([
            ...content,
            {
                role: "user",
                content: customerQueryLocal,
            },
        ]);
        setcustomerQuery("");

        console.log(`chatContent: ${JSON.stringify(chatContent)} botid: ${botid}`);
        const response = await fetch('/api/ask-ai-stream', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatContent: [
                    ...content,
                    {
                        role: "user",
                        content: botInfo?.name + " " + customerQueryLocal,
                    },
                ],
                bot_id: botid,
            }),
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        var fullText;
        var chatAdded = false;
        setstreaming(true);
        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            // settext((prev) => prev + chunkValue);
            if (fullText === undefined) {
                fullText = chunkValue;
            } else {
                fullText = fullText + chunkValue
            }
            console.log(`chunkValue: ${chunkValue}`);
            setstreamingText((prev) => prev + chunkValue);
            // if chatAdded then update otherwise add 
            // if (!chatAdded) {
            //     setContent((prevChatContent) => [
            //         ...prevChatContent,
            //         {
            //             role: "assistant",
            //             content: fullText,
            //         },
            //     ]);
            //     chatAdded = true;
            // } else {
            //     // update content with new answer replacing the previous answer
            //     var contentLocal = content;
            //     contentLocal[contentLocal.length - 1].content = fullText;
            //     setContent(contentLocal);
            // }
        }
        setContent(prevChatContent => [
            ...prevChatContent,
            {
                role: 'assistant',
                content: fullText,
            }
        ]);
        setstreamingText("");
        setstreaming(false);
        setloading(false);
    }

    // function askAI() {
    //     setloading(true)
    //     var customerQueryLocal = inputRef.current.value;;
    //     setcustomerQuery("");
    //     setContent([
    //         ...content,
    //         {
    //             role: 'user',
    //             content: customerQueryLocal,
    //         },
    //     ]);
    //     // make a call to ask-ai api with the content messages
    //     fetch(askAIbaseURL, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'

    //         },
    //         body: JSON.stringify({
    //             chatContent: [
    //                 ...content,
    //                 {
    //                     role: 'user',
    //                     content: botInfo.name + customerQueryLocal,
    //                 },
    //             ], bot_id: botid
    //         })
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log('Answer:', data.answer + "contextString" + data.contextString + `prompt: ${data.prompt}`);
    //             // add answer to chat
    //             if (data.answer) {
    //                 setContent(prevChatContent => [
    //                     ...prevChatContent,
    //                     {
    //                         role: 'assistant',
    //                         content: data.answer
    //                     }
    //                 ]);
    //             }
    //             // update questioncount 
    //             if (data.prompt) {
    //                 setbotQuestionCount(prevCount => prevCount - 1);
    //             }
    //             // add Q&A to database
    //             if (customerQueryLocal && data.answer) {
    //                 addQnA(customerQueryLocal, data.answer);
    //             }
    //             // hide thinking
    //             document.getElementById("ai-thinking").style.display = "none";
    //             setloading(false);
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //             showSnackbar("Something went wrong. Please try again later.");
    //             setloading(false);
    //         });
    //     inputRef.current.value = ""; // Clear the input field
    // }

    useEffect(() => {
        getBotInfoSupabase();
        if (customer?.id) {
            fetchBotQuestionCountFromSupabase();
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [streamingText]);

    async function addQnA(question, answer) {
        console.log('Adding QnA:', botid, question, answer);
        try {
            const response = await fetch('https://www.secondbrain.fyi/api/add-qna', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bot_id: botid, question: question, answer: answer }),
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

    return (
        <div className={`${classNames} border p-3 rounded-md max-w-3xl h-[36rem] flex flex-col justify-between`}>
            {/* do not include the first system message and last assistant message */}
            <div style={{ "overflow": "scroll", paddingBottom: "24px" }}>
                {content.slice(1).map((message, index) => (
                    <div ref={chatContainerRef} key={index} className={`float-${message.role === 'user' ? 'right justify-end' : 'left justify-start'} flex clear-both ${message.role === 'user' ? 'ml-8' : 'mr-8'}`}>
                        {message.role === 'user' ? <div
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
                        </div> : <div
                            className={`float-left mb-2 overflow-auto rounded-lg py-3 px-4 inline-block max-w-full`}
                            style={{
                                backgroundColor: 'rgb(244, 244, 245)',
                                color: 'black',
                            }}
                        >
                            <div className="flex space-x-3">
                                <div className="flex-1 gap-4">
                                    <div className="prose text-inherit text-sm">
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>

                ))
                }
                {streaming && <div
                    className={`float-left mb-2 overflow-auto rounded-lg py-3 px-4 inline-block max-w-full`}
                    style={{
                        backgroundColor: 'rgb(244, 244, 245)',
                        color: 'black',
                    }}
                >
                    <div className="flex space-x-3">
                        <div className="flex-1 gap-4">
                            <div className="prose text-inherit text-sm">
                                <ReactMarkdown>{streamingText}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>}
                {/* {<div style={{ display: 'flex', justifyItems: 'flex-start', width: '100%' }}>
                    <div id="ai-thinking" style={{ display: loading ? 'block' : 'none' }} className="chat-bubble">
                        <div className="typing">
                            <div className="dot" />
                            <div className="dot" />
                            <div className="dot" />
                        </div></div>
                </div>} */}
            </div>
            {<form onSubmit={(e) => {
                e.preventDefault();
                askAI();
            }} id="secondbrain.fyi-message_form" autoComplete="off" >
                {!isEmbed && <p className="pb-1 text-gray-600 clear-both text-xs font-light">{botQuestionCount} message credits left</p>}
                <div className="flex items-center" style={{ marginTop: '12px', display: 'flex', width: '100%', border: '1px solid lightgray', borderRadius: '4px' }}>
                    <input
                        onChange={(e) => {
                            setcustomerQuery(e.target.value);
                        }}
                        value={customerQuery}
                        id="secondbrain.fyi-input" style={{ fontSize: "14px", width: '100%', border: 'none', padding: '12px', borderRadius: '4px', outline: 'none', fontFamily: 'Plus Jakarta Sans' }} />
                    {gettingBotInfo ? <p className='text-sm text-gray-500 mr-4'>Loading...</p> : <button id="secondbrain.fyi-send" style={{ border: 'none', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <svg style={{ height: '20px', width: '20px', marginRight: '6px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>}
                </div>
            </form>}
        </div >
    )
}

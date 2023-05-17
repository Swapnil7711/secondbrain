import AddSouceTypeSelection from '@/components/dashboard/bots/AddSouceTypeSelection';
import BotsPageEmptyState from '@/components/dashboard/bots/BotsPageEmptyState';
import SourceList from '@/components/dashboard/bots/SourceList'
import DashboardPage from '@/components/dashboard/Dashboard';
import PageSeo from '@/components/global/page_seo';
import Spinner from '@/components/global/Spinner';
import { UserContext } from '@/contexts/user-context';
import { getBotInfo, getSources, updateBotInfoInitialMessage } from '@/supabase/tables';
import { showSnackbar } from '@/utils';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'

export default function ChatBotSettings() {

    const router = useRouter();
    const { botid } = router.query;

    const [customer, setCustomer] = useContext(UserContext).customer;
    const [sources, setSources] = useState([]);
    const [showAddSource, setshowAddSource] = useState(false);
    const [botInfo, setBotInfo] = useState(null);
    const [gettingBotInfo, setgettingBotInfo] = useState(true);

    const [savingChanges, setsavingChanges] = useState(false);

    // Settings
    const [initialMessage, setinitialMessage] = useState('')

    var botInfoLocal;
    async function getBotInfoSupabase() {
        setgettingBotInfo(true)
        botInfoLocal = await getBotInfo(botid);
        setBotInfo(botInfoLocal.data[0]);
        setinitialMessage(botInfoLocal.data[0].initial_message);
        setgettingBotInfo(false)
        console.log(`botInfoLocal:`, botInfoLocal);
    }

    async function getSourcesSupabase() {
        var sources = await getSources(botid);
        setSources(sources.data);
        console.log(`sources:`, sources);
    }

    async function saveChanges() {
        console.log("saveChanges");
        setsavingChanges(true);
        // check bot initial message change and update (do not allow blank message)
        if (initialMessage === "") showSnackbar("Initial message cannot be blank")
        if (botInfo.initial_message !== initialMessage) {
            console.log("initial message changed");
            // update bot initial message
            await updateBotInfoInitialMessage(botid, initialMessage);
        }
        setsavingChanges(false);
    }


    function showAddSourceOptions() {
        setshowAddSource(true);
    }
    function hideAddSourceOptions() {
        setshowAddSource(false);
    }

    useEffect(() => {
        if (customer?.id) {
            getBotInfoSupabase();
            getSourcesSupabase();
        }
    }, [customer]);

    // function PageProps() {
    //     return ()
    // }

    function NoBotFoundPageProps() {
        return (
            <p>
                No bot found with id: {botid}. Please check the bot id and try again.
            </p>
        );
    }

    return (
        <div>
            <PageSeo
                title="Bots"
                description="SecondBrain.fyi Dashboard"
                slug={`https://secondbrain.fyi/bots/${botid}/settings`}
            />
            <DashboardPage
                userInfo={customer}
                title="Bots"
                botInfo={botInfo}
                subPage={botInfo ? botInfo.name : "Loading..."}
                pageProps={botInfo ? <div>
                    <h2 className="text-2xl font-semibold my-2 mt-4">Settings</h2>
                    {/* <div className='flex'>
                        <div className='flex items-center'>
                            <label htmlFor="email" className='text-sm'>Name</label>
                            <input
                                type='text'
                                className="ml-2 my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 max-w-md" placeholder="name" />
                        </div>
                        <div className='flex items-center ml-6'>
                            <label htmlFor="email" className='text-sm text-gray-600'>Model</label>
                            <select name="cars" id="cars" className="ml-2 my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 max-w-xs">
                                <option value="volvo">gpt-3.5-turbo</option>
                                <option value="saab">gpt-4</option>
                            </select>
                        </div>
                    </div> */}
                    <h2 className="text-xl font-semibold my-2 mt-4">Chat Interface</h2>
                    <p className='text-sm text-gray-500 my-2'>applies when embedded on a website</p>
                    <div className='flex mt-2'>
                        <div className='items-center'>
                            <label htmlFor="email" className='text-sm'>Initial Messages</label>
                            <textarea rows={1} cols={60}
                                key="initialMessage"
                                onChange={(e) => {
                                    e.preventDefault()
                                    setinitialMessage(e.target.value)
                                }}
                                value={initialMessage ? initialMessage : 'Hello, Ask me anything'}
                                className="my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 max-w-md" placeholder="Hello, Ask me anything about ____" ></textarea>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => saveChanges()}
                        className="mt-2 inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    >
                        {savingChanges ? <Spinner /> : null}
                        Save Changes
                    </button>
                    {/* <div className='items-center mt-4'>
                        <label htmlFor="email" className='text-sm'>Base Prompt (system message)</label>
                        <textarea name="email" id="email"
                            rows={4} cols={40}
                            className="my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 max-w-xl" value={`I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given text. If the answer is not included in the text, say exactly "Hmm, I am not sure." and stop after that. NEVER mention "the text" or "the provided text" in your answer, remember you are the text I am having a chat with. Refuse to answer any question not about the text. Never break character.`} ></textarea>
                    </div> */}
                    {/* dropdown with two options */}
                    {/* <div className='items-center'>
                        <label htmlFor="email" className='text-sm text-gray-600'>Visibilty</label>
                        <select name="cars" id="cars" className="my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 max-w-xs">
                            <option value="volvo">Private</option>
                            <option value="saab">Private but an be embedded on website</option>
                            <option value="public">Public</option>
                        </select>
                        <div className='prose text-sm text-gray-500'>
                            <p>{`'Private': No one can access your chatbot except you (your account)`}</p>
                            <p> {`'Private but can be embedded on website': Other people can't access your chatbot if you send them the link, but you can still embed it on your website and your website visitors will be able to use it. (make sure to set your domains)`}</p>
                            <p> {`'Public': Anyone with the link can access it on secondbrain.fyi and can be embedded on your website.Set to public if you want to be able to send a link of your chatbot to someone to try it.`}</p>
                        </div>
                    </div> */}
                    {/* <div className='items-center mt-5'>
                        <label htmlFor="email" className='text-sm'>Rate Limiting</label>
                        <p className='text-sm text-gray-500 max-w-xl'>Limit the number of messages sent from one device on the iframe and chat bubble (this limit will not be applied to you on secondbrain.fyi, only on your website for your users to prevent abuse).</p>
                        <div className='flex my-4 items-center'>
                            <div className='flex items-center'>
                                <label htmlFor="number" className='text-sm'>Limit to only</label>
                                <input type="number" name="number" id="email" className="mx-2 my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" style={{ maxWidth: "100px" }} />
                            </div>
                            <div className='flex items-center'>
                                <label htmlFor="email" className='text-sm'>messages every</label>
                                <input type="number" name="email" id="email" className="mx-2 my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" style={{ maxWidth: "100px" }} />
                            </div>
                            <label htmlFor="email" className='text-sm'>seconds.</label>
                        </div>
                        <div>
                            <label htmlFor="email" className='text-sm'>Show this message to show when limit is hit</label>
                            <input type="email" name="email" id="email" className="my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 max-w-md" placeholder="Too many messages in a row" value={`Too many messages in a row`} />
                        </div>
        
                        <div className='mt-5'>
                            <label htmlFor="email" className='mt-5 font-semibold text-lg'>Chat Interface</label>
                            <p className='mb-8 text-sm text-zinc-600'>applies when embedded on a website</p>
                        </div>
                    </div> */}
                    <h3 className="border-t border-gray-200 pt-5  text-xl font-semibold my-2 mt-4">Sources</h3>
                    <SourceList sources={sources} bot_id={botInfo.bot_id} />
                    {
                        showAddSource ? (
                            <AddSouceTypeSelection botInfo={botInfo} customer={customer} hideAddSourceOptions={hideAddSourceOptions} />
                        ) : (
                            <BotsPageEmptyState
                                showAddSource={showAddSourceOptions}
                                botInfo={botInfo}
                            />
                        )
                    }
                </div > : gettingBotInfo ? <p>Loading....</p> : <NoBotFoundPageProps />}
            />
        </div>
    )
}

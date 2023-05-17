import React, { useState } from 'react';

const EmbedInfoPopup = ({ bot_id }) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <div>
            <button onClick={togglePopup} className="mt-2 p-1 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-zinc-300">Show Embed Info</button>
            {showPopup && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-10"
                    onClick={togglePopup}
                ></div>
            )}
            {showPopup && (
                <div
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded-lg p-6 z-20 w-11/12 md:w-1/2 max-w-screen-md"
                >
                    <h3 className='text-xl font-bold mb-2'
                    >Embed on website</h3>
                    <p className='my-4'>Public Url</p>
                    <pre className='whitespace-pre-wrap break-words bg-gray-100 rounded-md p-3'>
                        {`https://www.secondbrain.fyi/chat/${bot_id}`}
                    </pre>
                    <p className='my-4'>To add the chatbot any where on your website, add this iframe to your html code</p>
                    <pre className='whitespace-pre-wrap break-words bg-gray-100 rounded-md p-3'>
                        {`<iframe src="https://www.secondbrain.fyi/chat/${bot_id}" width="100%" height="700" frameborder="0"></iframe>`}
                    </pre>
                    <p className='my-4'>To add a chat bubble to the bottom right of your website add this script tag to your html</p>
                    <pre className='whitespace-pre-wrap break-words bg-gray-100 rounded-md p-3'>
                        {`<script src="https://script.secondbrain.fyi/js/widget-raw.min.js" id="${bot_id}"></script>`}
                    </pre>
                    <button onClick={togglePopup} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Close</button>
                </div>
            )}
        </div>
    );
};

export default EmbedInfoPopup;

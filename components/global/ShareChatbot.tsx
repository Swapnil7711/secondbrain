import React, { useState } from 'react';

const ShareChatbot = ({ className, bot_id }: {
    className?: string, bot_id: string
}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <div className={`${className}`}>
            <button onClick={togglePopup} className="mt-2 p-1 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-zinc-300">Show Chatbot</button>
            {showPopup && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-10"
                    onClick={togglePopup}
                ></div>
            )}
            {showPopup && (
                <div
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-black rounded-lg p-6 z-20 w-11/12 md:w-1/2 max-w-screen-md"
                >
                    <h3 className='text-xl font-bold mb-2'>Share your chatbot</h3>
                    <p className='my-4'>Use this link to access the chatbot</p>
                    <pre className='whitespace-pre-wrap break-words bg-gray-100 rounded-md p-3'>
                        {`https://www.secondbrain.fyi/chat/${bot_id}`}
                    </pre>
                    <button onClick={togglePopup} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Close</button>
                </div>
            )}
        </div>
    );
};

export default ShareChatbot;

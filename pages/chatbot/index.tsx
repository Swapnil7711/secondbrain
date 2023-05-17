import React from 'react'

export default function ChatBot() {
    return (
        <div>
            <div className="flex justify-between mt-10">
                <h2 className="text-2xl font-bold my-2 mt-4">Demo</h2>
                {/* two buttons and three dots tailwind */}
                <div>
                    <button
                        type="button"
                        className=" mt-2 p-1 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-zinc-300"
                    >
                        Embed on website
                    </button>
                    <button
                        type="button"
                        className="ml-2 mt-2 p-1 inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-zinc-300"
                    >
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

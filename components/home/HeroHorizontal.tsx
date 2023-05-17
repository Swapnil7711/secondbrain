import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import ReactPlayer from 'react-player'

export default function HeroHorizontal() {
    return (
        <div className="relative isolate overflow-hidden bg-white">
            <svg
                className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                aria-hidden="true"
            >
                <defs>
                    <pattern
                        id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
                        width={200}
                        height={200}
                        x="50%"
                        y={-1}
                        patternUnits="userSpaceOnUse"
                    >
                        <path d="M.5 200V.5H200" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" strokeWidth={0} fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" />
            </svg>
            <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-20">
                <div className="text-center sm:text-left mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
                    <h1 className="mt-10 text-4xl font-bold text-gray-900 sm:text-5xl" style={{ lineHeight: "1.2" }}>
                        <div>Got Questions 🤔?</div>
                        <div>Ask My 🧠 Second Brain!</div>
                    </h1>
                    <p className="mt-6 text-lg leading-7 text-gray-600">
                        {`Ever wished your website could talk back? Well, now it can! Meet SecondBrain.fyi, your AI chatbot sidekick. it can answer all those repetitive questions so you don’t have to.`}
                    </p>
                    <div className="mt-10 flex justify-center sm:justify-start items-center gap-x-6">
                        <Link
                            href="/signup"
                            className="flex items-center rounded-md bg-gray-800 px-3.5 py-2.5 text-base font-semibold text-white shadow-sm  hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        >
                            <Image
                                height={40}
                                width={40}
                                className="h-7 w-auto mr-2"
                                src="/assets/logo-white.svg"
                                alt=""
                            />
                            Create Free SecondBrain Bot
                        </Link>
                        {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                            Learn more <span aria-hidden="true">→</span>
                        </a> */}
                    </div>
                </div>
                <div>
                    <div className="pt-5 sm:pt-20 mx-auto mt-6 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-12">
                        <div className="max-w-3xl flex sm:max-w-5xl lg:max-w-none">
                            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                <video
                                    className="storyPlayer__reactPlayer rounded-lg shadow-lg mx-auto"
                                    controls={true}
                                    autoPlay={true}
                                    height={"500px"}
                                    width={"500px"}
                                    src="https://user-images.githubusercontent.com/55942632/230902796-fdb985a9-b18d-4b96-a3ba-cff05fce1812.mp4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

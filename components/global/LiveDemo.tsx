import { ArrowPathIcon, CloudArrowUpIcon, LockClosedIcon } from '@heroicons/react/20/solid'
export default function LiveDemo() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
                    <p className="text-center mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Live Demo
                    </p>
                    <p className="text-center mt-6 text-lg leading-8 text-gray-600">
                        This chatbot was trained on secondbrain.fyi webpages <br />
                        You can embed a widget like this on any page on your website!
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <iframe src="https://www.secondbrain.fyi/chat/4ebe74cb-c878-493b-ad5e-a0cd7a2be7d8" width="100%" height={700} frameBorder={0} />
                </div>
            </div>
        </div>
    )
}

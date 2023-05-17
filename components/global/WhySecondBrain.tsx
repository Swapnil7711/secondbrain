import { ArrowPathIcon, CloudArrowUpIcon, LockClosedIcon } from '@heroicons/react/20/solid'

const features = [
    {
        name: 'Easy Setup',
        description:
            'Just provide a link to your website or upload documents, and our AI will quickly learn from your content.',
        href: '#',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'Multilingual Support',
        description:
            'SecondBrain.fyi can understand and respond to questions in over 95 languages.',
        href: '#',
        icon: LockClosedIcon,
    },
    {
        name: 'Customizable',
        description:
            'Personalize your chatbot with a unique name, instructions, and even specific language preferences.',
        href: '#',
        icon: ArrowPathIcon,
    },
    {
        name: 'Secure Data Storage',
        description:
            'Your document content is hosted securely on our servers, and we never share your data with third parties.',
        href: '#',
        icon: ArrowPathIcon,
    },
    {
        name: 'Powered by ChatGPT & GPT-4',
        description:
            'Harness the power of cutting-edge AI to ensure an exceptional chatbot experience.',
        href: '#',
        icon: ArrowPathIcon,
    },
]

export default function WhySecondBrain() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
                    <p className="text-center mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Why Choose SecondBrain.fyi?
                    </p>
                    {/* <p className="text-center mt-6 text-lg leading-8 text-gray-600">
                        Effortlessly integrate a customizable, multilingual chatbot powered by cutting-edge AI, ensuring exceptional user experience and secure data handling.
                    </p> */}
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}

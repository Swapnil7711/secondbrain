import { ArrowPathIcon, CloudArrowUpIcon, LockClosedIcon } from '@heroicons/react/20/solid'

const features = [
    {
        name: 'Instant Support',
        description:
            'Keep customers happy with quick, detailed responses to their questions using your content and documentation.',
        href: '#',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'Internal Knowledge Sharing',
        description:
            `Boost your team's productivity with instant access to relevant information.`,
        href: '#',
        icon: LockClosedIcon,
    },
    {
        name: 'AI Copywriting',
        description:
            'Generate high-quality content using a ChatGPT tailored to your business. (tutorials coming soon)',
        href: '#',
        icon: ArrowPathIcon,
    },
    {
        name: 'Integration Options',
        description:
            'Easily add SecondBrain.fyi to your website, app, Slack, or any other platform. (tutorials coming soon)',
        href: '#',
        icon: ArrowPathIcon,
    },
    {
        name: 'Advanced Analytics',
        description:
            'Gain insights into chat history, popular questions, and more. (coming soon)',
        href: '#',
        icon: ArrowPathIcon,
    },
]

export default function MagicFeatures() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
                    <p className="text-center mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Features that Make Magic Happen
                    </p>
                    <p className="text-center mt-6 text-lg leading-8 text-gray-600">

                    </p>
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

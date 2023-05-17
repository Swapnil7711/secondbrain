import { CheckCircleIcon, CheckIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { useCookies } from 'react-cookie';
import { Plan } from '@/interfaces';
import { loadStripe } from '@stripe/stripe-js';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const loadStripeSdk = async (sessionId: string) => {
    if (!sessionId) return;
    localStorage.setItem('sessionId', sessionId);
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY as string);

    stripe
        ?.redirectToCheckout({
            sessionId,
        })
        .then(function (result) {
            if (result.error) {
                alert(
                    `Checkout failed with error - ${result?.error?.message}. Please report the issue at sanskar@blurweb.app`
                );
            }
        })
        .catch(function (e) {
            alert(
                `Checkout failed with error - ${e?.message}. Please report the issue at sanskar@blurweb.app`
            );
        });
};

export default function FourTierPricingSection({ country, }: { country: "in" | "nonIn"; }) {
    const [cookies, setCookie] = useCookies(['Rewardful.referral']);
    const [pricingPlan, setPricingPlan] = useState<Plan | undefined>();

    const frequencies = [
        { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
        { value: 'annually', label: 'Annually', priceSuffix: '/year' },
    ]
    const [frequency, setFrequency] = useState(frequencies[0]);

    const EnterpriseTiers: {
        name: Plan,
        id: string,
        href: string,
        price: { monthly: string, annually: string },
        description: string,
        features: string[],
        mostPopular: boolean
    }[] = [{
        name: "enterprise",
        id: 'tier-enterprise',
        href: '#',
        price: { monthly: '$499', annually: '$4990' },
        description: 'For power users who want to publish multiple AskAIs with large amounts of content.',
        features: [
            `40,000 message credits/month included (Messages over the limit will use your OpenAI API Key)`,
            `40 SecondBrain Bots`,
            `11,000,000 characters/chatbot`,
            `Embed on unlimited websites`,
            `Add Pdf File, Text and links`,
            `API Access`,
            `Remove SecondBrain branding`
        ],
        mostPopular: false,
    },]

    const tiers: {
        name: Plan,
        id: string,
        href: string,
        price: { monthly: string, annually: string },
        description: string,
        features: string[],
        mostPopular: boolean
    }[] = [
            // {
            //     name: "starter",
            //     id: 'tier-starter',
            //     href: '#',
            //     price: { monthly: '$0', annually: '$0' },
            //     description: 'Take it for a spin, and see what everyone’s talking about.',
            //     features: [`Create 1 SecondBrain Bot`,
            //         `Ask 50 questions/mo`,
            //         `Email support`,
            //         `Add Pdf File, Text and links`,
            //         `SecondBrain branding`,
            //         `Share via link or embed`,],
            //     mostPopular: false,
            // },
            {
                name: "hobby",
                id: 'tier-hobby',
                href: '#',
                price: { monthly: '$19.99', annually: '$199' },
                description: 'Create your own basic MaigcChatBot for quick answers and copywriting.',
                features: [
                    `2,000 message credits/month`,
                    `Create 5 SecondBrain Bots`,
                    `2,000,000 characters/chatbot`,
                    `Embed on unlimited websites`,
                    `Add Pdf File, Text and links`,
                    `API Access`
                ],
                mostPopular: false,
            },
            {
                name: "power",
                id: 'tier-power',
                href: '#',
                price: { monthly: '$49', annually: '$490' },
                description: 'For power users and small businesses just getting started.',
                features: [
                    `5,000 message credits/month`,
                    `Create 10 SecondBrain Bots`,
                    `4,000,000 characters/chatbot`,
                    `Embed on unlimited websites`,
                    `Add Pdf File, Text and links`,
                    `API Access`
                ],
                mostPopular: true,
            },
            {
                name: "pro",
                id: 'tier-pro',
                href: '#',
                price: { monthly: '$99', annually: '$990' },
                description: 'For companies and serious creators who care about their time.',
                features: [
                    `10,000 message credits/month`,
                    `Create 20 SecondBrain Bots`,
                    `6,000,000 characters/chatbot`,
                    `Embed on unlimited websites`,
                    `Add Pdf File, Text and links`,
                    `API Access`
                ],
                mostPopular: false,
            },
        ]

    const checkout = async (plan: Plan, yearlyornot: boolean) => {
        setPricingPlan(plan);
        console.log(`plan:${plan} yearlyornot:${yearlyornot}`);
        var rewardFulId = cookies['rewardful.referral'] ? cookies['rewardful.referral']['id'] : '';

        const sessionIdResp = await fetch(`/api/checkout`, {
            method: 'post',
            body: JSON.stringify({
                plan,
                yearlyornot,
                rewardFulId
            }),
        });
        const { sessionId } = await sessionIdResp.json();

        loadStripeSdk(sessionId);
    };

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    {/* <h2 className="text-base font-semibold leading-7 text-gray-600">Pricing</h2> */}
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Pricing
                    </p>
                </div>
                {/* <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                    Save money and time with SecondBrain. We offer a variety of plans to fit your needs. Need a custom plan? Contact us.
                </p> */}
                {/* <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-blue-600">7 day money back guarantee, cancel anytime</p> */}
                {/* <div className="mt-16 flex justify-center">
                    <RadioGroup
                        value={frequency}
                        onChange={setFrequency}
                        className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
                    >
                        <RadioGroup.Label className="sr-only">Payment frequency</RadioGroup.Label>
                        {frequencies.map((option) => (
                            <RadioGroup.Option
                                key={option.value}
                                value={option}
                                className={`${option.value === "monthly" ? 'bg-gray-600 text-white' : 'bg-white text-gray-500'} cursor-pointer rounded-full py-1 px-2.5`}
                            >
                                <span>{option.label}</span>
                            </RadioGroup.Option>
                        ))}
                    </RadioGroup>
                </div> */}
                <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={classNames(
                                tier.mostPopular ? 'ring-2 ring-gray-600' : 'ring-1 ring-gray-200',
                                'rounded-3xl p-8'
                            )}
                        >
                            <h3
                                id={tier.id}
                                className={classNames(
                                    tier.mostPopular ? 'text-gray-600' : 'text-gray-900',
                                    'text-2xl font-semibold leading-8'
                                )}
                            >
                                {tier.name}
                            </h3>
                            {/* <p className="mt-4 text-base leading-6 text-gray-600">{tier.description}</p> */}
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price[frequency.value]}</span>
                                <span className="text-sm font-semibold leading-6 text-gray-600">{frequency.priceSuffix}</span>
                            </p>
                            {tier.name === "starter" ?
                                <a
                                    href={'/signup'}
                                    aria-describedby={tier.id}
                                    className={classNames(
                                        tier.mostPopular
                                            ? 'bg-gray-600 text-white shadow-sm hover:bg-gray-500'
                                            : 'text-gray-600 ring-1 ring-inset ring-gray-200 hover:ring-gray-300',
                                        'mt-6 block rounded-md py-3 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
                                    )}
                                >
                                    Try SecondBrain.fyi
                                </a> : <button onClick={() => {
                                    checkout(tier.name, false);
                                }} className="mt-6 block w-full rounded-md border border-gray-800 bg-gray-800 py-3 text-center text-sm font-semibold text-white hover:bg-gray-900">Subscribe to {tier.name}</button>}
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <CheckCircleIcon className="h-6 w-5 flex-none text-gray-600" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {EnterpriseTiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={classNames(
                                tier.mostPopular ? 'ring-2 ring-gray-600' : 'ring-1 ring-gray-200',
                                'rounded-3xl p-8'
                            )}
                        >
                            <h3
                                id={tier.id}
                                className={classNames(
                                    tier.mostPopular ? 'text-gray-600' : 'text-gray-900',
                                    'text-2xl font-semibold leading-8 text-left'
                                )}
                            >
                                {tier.name}
                            </h3>
                            {/* <p className="mt-4 text-base leading-6 text-gray-600">{tier.description}</p> */}
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price[frequency.value]}</span>
                                <span className="text-sm font-semibold leading-6 text-gray-600">{frequency.priceSuffix}</span>
                            </p>
                            {tier.name === "starter" ?
                                <a
                                    href={'/signup'}
                                    aria-describedby={tier.id}
                                    className={classNames(
                                        tier.mostPopular
                                            ? 'bg-gray-600 text-white shadow-sm hover:bg-gray-500'
                                            : 'text-gray-600 ring-1 ring-inset ring-gray-200 hover:ring-gray-300',
                                        'mt-6 block rounded-md py-3 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
                                    )}
                                >
                                    Try SecondBrain.fyi
                                </a> : <button onClick={() => {
                                    checkout(tier.name, false);
                                }} className="mt-6 block w-full rounded-md border border-gray-800 bg-gray-800 py-3 text-center text-sm font-semibold text-white hover:bg-gray-900">Subscribe to {tier.name}</button>}
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3 text-start">
                                        <CheckCircleIcon className="h-6 w-5 flex-none text-gray-600" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {/* <div className="mx-auto max-w-lg text-center mt-10">
                </div> */}
                <p className='text-sm mt-5 text-gray-500 my-2'>question? send email to support@secondbrain.fyi</p>
            </div>
        </div>
    )
}

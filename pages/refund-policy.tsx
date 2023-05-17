import { appEmail, appName } from '@/utils'
import Head from 'next/head'
import React from 'react'
import PageSeo from '../components/global/page_seo'

function RefundPolicy() {
    return (
        <div>
            <PageSeo
                title="Refund Policy ~ SecondBrain.fyi"
                description="Refund Policy for SecondBrain.fyi"
                slug="/refund-policy"
            />
            <div className="relative overflow-hidden bg-white py-16" >
                <div className="relative px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-prose text-lg">
                        <h1><span className="mt-2 block text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">Refund Policy</span>
                        </h1>
                        <p className="mt-5 text-base text-gray-500 leading-8">Last updated: 30 Oct 2022</p>
                    </div>
                    <div className="prose prose-lg prose-indigo mx-auto mt-6">
                        <p>Overview</p>
                        <p>{`Thanks for purchasing our products (or subscribing to our services) at ${appName} operated by indianappguy.com.
We offer a full money-back guarantee for all purchases made on our website. If you are not satisfied with the product that you have purchased from us, you can get your money back no questions asked. You are eligible for a full reimbursement within 5 calendar days of your purchase.
After the 5-day period you will no longer be eligible and won't be able to receive a refund. We encourage our customers to try the product (or service) in the first two weeks after their purchase to ensure it fits your needs.
If you have any additional questions or would like to request a refund, feel free to contact us at ${appEmail}`}</p>
                    </div>
                </div>
            </div >
        </div>
    )
}

export default RefundPolicy
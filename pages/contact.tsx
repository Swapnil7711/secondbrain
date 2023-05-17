import { tallyFormID } from '@/utils'
import Link from 'next/link'
import React from 'react'
import PageSeo from '../components/global/page_seo'

export default function SupportPage() {
    return (
        <div className='w-full'>
            <PageSeo
                title="Support ~ SecondBrain.fyi"
                description="Support for SecondBrain.fyi"
                slug="/support"
            />
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
                <div className='max-w-2xl'>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Get in touch</h2>
                    {/* <p className="mt-6 text-base leading-7">We have <Link className='underline' href={'/help'}>help</Link> section documenting popular problems. You can send email to support@sheetai.app or just fill this form.</p>
                    <p className="mt-6 text-base leading-7">give us 24-48 hours to get back we are in IST timezone.</p> */}
                </div>
                <div className='my-10' style={{ display: "flex", justifyContent: "left" }}>
                    <iframe src={`https://tally.so/embed/${tallyFormID}?alignLeft=1&hideTitle=1&transparentBackground=1`} height={400} frameBorder={0} marginHeight={0} marginWidth={0} title="SecondBrain App Contact Us">
                    </iframe>
                </div >
            </div>
        </div>
    )
}

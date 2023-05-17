import { NotionAPI } from 'notion-client'
import React from 'react'
import { NotionRenderer } from 'react-notion-x'
import ReactPlayer from 'react-player'
import PageSeo from '../components/global/page_seo'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/global/header'
import Banner from '@/components/global/Banner'
const Code = dynamic(() =>
    import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
    import('react-notion-x/build/third-party/collection').then(
        (m) => m.Collection
    )
)
const Equation = dynamic(() =>
    import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
    () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
    {
        ssr: false
    }
)
const Modal = dynamic(
    () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
    {
        ssr: false
    }
)

export default function Thankyou({ recordMap }) {
    return (
        <div className="relative overflow-hidden" >
            <PageSeo
                title='Getting Started Guide SecondBrain.fyi'
                description='Quick guide(text+video) on how to create ChatGPT-like chatbot for your website'
                slug='/thankyou'
            />
            <Header />
            <div className="relative px-4 sm:px-6 lg:px-8 ">
                <div className="article-block max-w-prose bg-white p-4 sm:p-8 rounded" style={{ margin: "24px auto" }}>
                    <NotionRenderer components={{
                        Code,
                        Equation,
                        Modal,
                        Pdf,
                        nextImage: Image,
                        nextLink: Link
                    }} recordMap={recordMap} fullPage={true} disableHeader />
                </div>
            </div>
        </div >
    )
}

export async function getServerSideProps() {
    // get recordmap for notion page id fe1f316bc52745f39c4ab8b3811ef1f6
    var notionAPI2 = new NotionAPI()
    var recordMap = await notionAPI2.getPage("fe1f316bc52745f39c4ab8b3811ef1f6");
    if (recordMap) {
        return {
            props: {
                recordMap: recordMap,
            },
            // Next.js will attempt to re-generate the page:
            // - When a request comes in
            // - At most once every 60 seconds
            // revalidate: 3600,
        };
    } else {
        return {
            notFound: true,
        }
    }
}
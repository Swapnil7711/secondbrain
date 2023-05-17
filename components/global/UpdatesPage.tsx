import { NotionAPI } from 'notion-client'
import React from 'react'
import { NotionRenderer } from 'react-notion-x'
import ReactPlayer from 'react-player'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import PageSeo from './page_seo'
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

export default function UpdatesSection({ recordMap }) {
    return (
        <div className="relative overflow-hiddenpy-16" >
            <PageSeo
                title={`SecondBrain.fyi Updates`}
                description={`Keep up with SecondBrain.fyi updates`}
                slug={`/updates`}
            />
            <div className="relative px-4 sm:px-6 lg:px-8 py-4">
                <div className="article-block max-w-prose bg-white p-4 sm:p-8 sm:pt-0" style={{ margin: "24px auto" }}>
                    <NotionRenderer components={{
                        Code,
                        Equation,
                        Modal,
                        Pdf,
                        nextImage: Image,
                        nextLink: Link
                    }} recordMap={recordMap} fullPage={false} disableHeader />
                </div>
            </div>
        </div >
    )
}


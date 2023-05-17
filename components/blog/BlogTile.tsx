import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { domain } from '../../utils'

function BlogTile({ title, desc, date, slug, tags }: {
    title: string, desc?: string, date: string, slug: string, tags: any
}) {
    return (
        <Link href={`${slug}`} title={`link to https://www.sheetai.app${slug}`} className="no-underline cursor-pointer flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-lg h-full border">
            {/* <div className="flex-shrink-0">
                <BlurImage width={400} height={200} className="h-48 w-full object-cover" src={ogImage ? ogImage : "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"} alt="" />
            </div> */}
            <div className="flex flex-1 flex-col justify-between bg-white px-6 py-4">
                <div className="flex-1">
                    {/* <p className="text-sm font-medium text-gray-600">
                        <Link href="#" className="hover:underline">{JSON.stringify(tags)}</Link>
                    </p> */}
                    <div className="block">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        {desc && <p className="mt-2 text-base">{desc}</p>}
                    </div>
                </div>
                <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                        <a href="#">
                            <span className="sr-only">Sanskar Tiwari</span>
                        </a>
                    </div>
                    <div >
                        <p className="text-sm font-medium text-gray-900">
                            <a href="#" className="hover:underline">Sanskar Tiwari</a>
                        </p>
                        <div className="flex space-x-1 my-2 text-sm text-gray-500">
                            <time dateTime="2020-03-16">{new Date(date.toString()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
                            <span aria-hidden="true">·</span>
                            <span>6 min read</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default BlogTile
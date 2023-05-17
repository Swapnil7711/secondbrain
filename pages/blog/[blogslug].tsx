import React, { useEffect, useState } from 'react';
const { Client } = require('@notionhq/client');
import { NotionAPI } from 'notion-client';
import { NotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic'

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
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import PageSeo from '../../components/global/page_seo';
import Header from '@/components/global/header';
import SimpleFooter from '@/components/global/SimpleFooter';

function BlogSlug({ results, recordMap, paths, pageTitle, pageDesc, blogSlug, pageDate }) {
    console.log(`paths: ${paths}`);

    const [domainUrl, setdomainUrl] = useState("");

    useEffect(() => {
        setdomainUrl(window.location.origin)
    }, [])

    return (
        <>
            <Header />
            <div className="px-4 md:px-0 md:flex-row justify-between items-start md:items-center max-w-7xl mx-auto my-10">
                <PageSeo
                    title={pageTitle}
                    description={pageDesc}
                    slug={blogSlug}
                    ogimage={encodeURI(`https://www.sheetai.app/api/og?title=${pageTitle}`)}
                />
                <div className="">
                    <div className="article-block bg-white p-4 sm:p-8 rounded" style={{ maxWidth: "800px", margin: "24px auto" }}>
                        <div className='flex-col md:flex-row' style={{ margin: "16px 0px", padding: '0px', justifyContent: 'center' }}>
                            <h1 className='text-4xl font-bold mr-2'>
                                {pageTitle}
                            </h1>
                            <div className='w-full my-6' style={{ display: "flex", alignItems: "center" }}>
                                {/* image */}
                                {/* <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e2a57b]">
                                    <span className="font-medium leading-none text-white">ST</span>
                                </span> */}
                                <img src="/assets/images/sanskar-profile.jpeg" className="h-10 w-10 rounded-full" />
                                {/* author name and time */}
                                <div style={{ margin: "0px", marginLeft: "16px" }}>
                                    <p className='font-medium' style={{ margin: "0px", lineHeight: "20px" }}>Sanskar Tiwari</p>
                                    <time style={{ margin: "4px 0px", fontSize: "14px", lineHeight: "20px" }}>{new Date(pageDate.toString()).toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" })}</time>
                                </div>
                            </div>
                        </div>
                        <NotionRenderer components={{
                            Code,
                            Equation,
                            Modal,
                            Pdf,
                            nextImage: Image,
                            nextLink: Link
                        }} recordMap={recordMap} fullPage={false} disableHeader />

                        {/* <div className="notion light-mode notion-page" style={{ padding: "42px 0px !important" }}>
                        {paths && <h3 className='text-2xl font-semibold my-5'>You May Also Like</h3>}
                        <ul style={{ listStyle: "square" }} >{paths && paths.map((path) => (
                            <li className='hover:underline' key={path['id']} style={{ padding: "8px 0px" }}>
                                <Link href={path['slug']}>{path['title']}
                                </Link>
                            </li>
                        ))}</ul>
                    </div> */}
                    </div>
                </div>
            </div>
            <SimpleFooter />
        </>
    )
}

// export async function getStaticPaths() {
//     // get all blog slugs via notion api database query
//     const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_TOKEN });
//     const response = await notion.databases.query({
//         database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID,
//         filter: {
//             property: 'Published',
//             checkbox: {
//                 equals: true,
//             },
//         },
//     });
//     const paths = response && response.results.map((result) => ({
//         params: { blogslug: result['properties']['Slug']['formula']['string'] },
//     }));

//     return {
//         paths: paths,
//         fallback: true
//     }
// }

export async function getServerSideProps({ params }) {

    try {
        // get blog post via notion api database query
        const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_TOKEN });
        var blogSlug = params.blogslug;
        const response = await notion.databases.query({
            database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID,
            filter: {
                property: 'Published',
                checkbox: {
                    equals: true,
                },
            },
        });
        var paths = response && response.results.map((result) => ({
            slug: result['properties']['Slug']['formula']['string'],
            title: result['properties']['Name']['title'][0]['plain_text'],
            desc: result['properties']['Desc']['rich_text'][0]['plain_text'],
            id: result['id'],
        }));

        // get page id & title where properties slug = blogSlug
        var pageId = response.results.filter((result) => result['properties']['Slug']['formula']['string'] === blogSlug)[0]['id'] || "";
        var pageTitle = response.results.filter((result) => result['properties']['Slug']['formula']['string'] === blogSlug)[0]['properties']['Name']['title'][0]['plain_text'];
        var pageDesc = response.results.filter((result) => result['properties']['Slug']['formula']['string'] === blogSlug)[0]['properties']['Desc']['rich_text'][0]['plain_text'];
        // var pageOGimage = response.results.filter((result) => result['properties']['Slug']['formula']['string'] === blogSlug)[0]['properties']['OGimage']['url'];
        var pageDate = response.results.filter((result) => result['properties']['Slug']['formula']['string'] === blogSlug)[0]['properties']['Date']['last_edited_time'];
        console.log(`pageId:`, pageId, `pageTitle:`, pageTitle, `pageDesc:`, pageDesc, `pageDate`, pageDate);

        // remove path from paths where slug = blogSlug
        paths = paths.filter((path) => path['slug'] !== blogSlug);

        var notionAPI2 = new NotionAPI()
        var recordMap = await notionAPI2.getPage(pageId);

        if (recordMap) {
            return {
                props: {
                    results: response.results,
                    recordMap: recordMap,
                    paths: paths,
                    pageTitle: pageTitle,
                    pageDesc: pageDesc,
                    blogSlug: blogSlug,
                    pageDate: pageDate
                },
                // Next.js will attempt to re-generate the page:
                // - When a request comes in
                // - At most once every 60 seconds
                // revalidate: 60,
            };
        } else {
            return {
                notFound: true,
            }
        }
    } catch (error) {
        return {
            notFound: true,
        }
    }

}

export default BlogSlug
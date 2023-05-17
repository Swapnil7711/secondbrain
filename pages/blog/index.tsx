import Head from 'next/head';
import Link from 'next/link'
import React from 'react'
import BlogTile from '../../components/blog/BlogTile';
import PageSeo from '../../components/global/page_seo';
import Header from '@/components/global/header';
import SimpleFooter from '@/components/global/SimpleFooter';
const { Client } = require('@notionhq/client');

export default function Blogs({ results }) {
    console.log(results)
    return (
        <>
            <Header />
            <div className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
                <PageSeo
                    title="SecondBrain.fyi Blog"
                    description="Learn how to use SecondBrain.fyi to build your own chatbots and automate your business."
                    slug='/blog'
                />
                <div className="relative mx-auto max-w-7xl">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">SecondBrain.fyi <span className=''>Blog</span></h1>
                        <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500 sm:mt-4">Learn how to use SecondBrain.fyi to build your own chatbots and automate your business.</p>
                    </div>
                    <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
                        {results.map((result) => (
                            <div key={result.id}>
                                {/* <a href={result['properties']['slug']['formula']['string']}></a> */}
                                {/* Blog post */}
                                <BlogTile
                                    title={result['properties']['Name']['title'][0]['plain_text']}
                                    // desc={result['properties']['Desc']['rich_text'][0]['plain_text'] ?? ''}
                                    tags={result['properties']['Tags']['multi_select']}
                                    slug={`/blog/` + result['properties']['Slug']['formula']['string']}
                                    // ogImage={result['properties']['OGimage']['url']}
                                    date={result['properties']['Date']['last_edited_time'] || ""}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <SimpleFooter />
        </>
    )
}


// getStaticProps function
export async function getStaticProps() {
    const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_TOKEN });
    const response = await notion.databases.query({
        database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID,
        filter: {
            property: 'Published',
            checkbox: {
                equals: true,
            },
        },
        sorts: [
            {
                property: 'Date',
                direction: 'descending',
            },
        ],
    });

    return {
        props: {
            results: response.results,
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 60 seconds
        revalidate: 60,
    };
}


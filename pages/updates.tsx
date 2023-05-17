import SimpleFooter from '@/components/global/SimpleFooter'
import UpdatesSection from '@/components/global/UpdatesPage'
import Header from '@/components/global/header'
import UpdatesHero from '@/components/updates/UpdatesHero'
import { NotionAPI } from 'notion-client'
import React from 'react'

export default function updates({ recordMap }) {
    return (
        <div>
            <Header />
            <UpdatesHero />
            <UpdatesSection recordMap={recordMap} />
            <SimpleFooter />
        </div>
    )
}

export async function getServerSideProps() {
    var notionAPI2 = new NotionAPI()
    var recordMap = await notionAPI2.getPage("90535b0abdeb456b882e77ca0cb08f2d");
    if (recordMap) {
        return {
            props: {
                recordMap: recordMap,
            },
        };
    } else {
        return {
            notFound: true,
        }
    }
}
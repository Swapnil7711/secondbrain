import Banner from "@/components/global/Banner";
import FAQComponent from "@/components/global/FAQ";
import Header from "@/components/global/header";
import PageSeo from "@/components/global/page_seo";
import FourTierPricingSection from "@/components/pricing/fourTierPricingSection";
import CompanyPricingSection from "@/components/pricing/pricingSection";
import { GetServerSideProps } from "next";
import React from "react";

export default function Pricing({ country }) {
    var faqs = [
        {
            question: "Is there a free plan?",
            answer:
                "Yes, just by signing up you get 30 message credits and 1 chatbot. You can use these to test out chatbase and see if it works for you.",
        },
        {
            question: "How do message credits work?",
            answer:
                "One AI response with gpt-3.5-turbo (the default) costs 1 message credit. One AI response with gpt-4 costs 20 message credits. You can change which model your chatbot uses in the chatbot settings. The difference is because gpt-4 costs 15x (prompt tokens) and 30x (completion tokens) what gpt-3.5-turbo costs on OpenAI.",
        },
        {
            question: "What counts as one chatbot?",
            answer:
                "One chatbot means a chatbot that contains specific data and can answer any question about this data. Even if it was created using multiple documents.",
        },
        {
            question: "How many users can use my chatbot?",
            answer:
                "If your chatbot is private, only you have access to it. If you decide to make it public, anyone with the link will be able to interact with it.",
        },
        {
            question: "How do I know how many characters are in my document?",
            answer:
                "Once you attach your document(s) for upload, SecondBrain.fyi will show you the character count of all the attached documents.",
        },
        {
            question: "Can I upload multiple files to one chatbot?",
            answer:
                "Yes, if you have a paid plan you can upload multiple files to one chatbot. Just click ctrl (windows) or cmd (mac) and select as many files as you want.",
        },
        {
            question: "How much data can I give one chatbot?",
            answer:
                "Free plan: 400K Characters (~5MB) | Hobby: 2M Characters (~24MB) | Standard: 4M Characters (~50MB) | Unlimited: 4M Characters (~50MB)",
        },
        {
            question: "How does the unlimited plan work?",
            answer:
                "You get 12,000 message credits included in the plan when you subscribe. Every message after that will use your OpenAI API key that you can add in your account page. So you get the cheapest possible price per message after you hit the limit.",
        },
    ];

    return (
        <div>
            <PageSeo
                title='SecondBrain.fyi Pricing'
                description='Choose the best plan based on your requirements'
                slug='/pricing'
            />
            <Header />
            <FourTierPricingSection country={country} />
            <FAQComponent faqs={faqs} />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<{
    country: "in" | "nonIn";
}> = async ({ req }) => {
    const ip = (req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress) as string;
    let ipRespJson: { countryCode?: string } = {};

    try {
        const ipResp = await fetch(`http://ip-api.com/json/${ip}`);
        ipRespJson = await ipResp.json();
    } catch (e) {
        ipRespJson = {};
    }

    return {
        props: {
            country: ipRespJson?.countryCode === "IN" ? "in" : "nonIn",
        },
    };
};

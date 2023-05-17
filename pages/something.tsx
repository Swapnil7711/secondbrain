import React, { useState } from 'react'

export default function Something() {
    const [generatedBios, setGeneratedBios] = useState('');
    const [loading, setLoading] = useState(false);

    const generateBio = async (e: any) => {
        console.log("Generating bio");
        e.preventDefault();
        setGeneratedBios("");
        setLoading(true);
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "prompt": "hakunmataa",
            }),
        })

        console.log(response);
        // if (!response.ok) {
        //     throw new Error(response.statusText);
        // }

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setGeneratedBios((prev) => prev + chunkValue);
        }
        setLoading(false);
    };

    return (
        <div>
            <form onSubmit={generateBio}>
                <input type="text" defaultValue="hakunmataa" />
                <button type="submit">Generate</button>
            </form>
            {loading && <p>Loading...</p>}
            <p>{generatedBios}</p>
        </div>
    )
}

import React, { useContext, useRef, useState } from 'react'
import axios from 'axios';
import { UserContext } from '@/contexts/user-context';
import { supabase } from '@/utils/SupabaseClient';
import { CheckCircleIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { showSnackbar } from '@/utils';
import Spinner from '@/components/global/Spinner';

export default function AddPDFSource({ hideAddSourceOptions, customer, botInfo }) {
    const [indexing, setindexing] = useState(false);
    const [uploadingPDF, setuploadingPDF] = useState(false);
    const [uploaded, setUploaded] = useState(false)
    const [markdown, setMarkdown] = useState('');
    const [title, setTitle] = useState('');
    const [pdfText, setPdfText] = useState('');

    const [error, setError] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [sourceURL, setsourceURL] = useState('')
    const [fileName, setfileName] = useState("")

    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        // upload file to supabase
        handleFileUpload(e.target.files[0]);
    };

    const getFileType = (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        switch (fileExtension) {
            case 'txt':
                return 'txt';
            case 'docx':
                return 'docx';
            case 'pptx':
                return 'pptx';
            case 'eml':
                return 'eml';
            case 'html':
            case 'htm':
                return 'html';
            case 'pdf':
                return 'pdf';
            default:
                throw new Error('Unsupported file type');
        }
    };

    function generateRandomAlphanumericKey(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    }

    const uploadFileToSupabase = async (file) => {
        console.log(`uploadFileToSupabase:`)
        const YOUR_BUCKET_NAME = 'user-upload-files';

        const randomKey = generateRandomAlphanumericKey(4);
        const newFileName = `${randomKey}-${file.name}`;

        const filePath = `${customer.user_id}/${newFileName}`;

        const { data, error } = await supabase.storage
            .from(YOUR_BUCKET_NAME)
            .upload(filePath, file, { upsert: true });

        if (error) {
            throw error;
        }
        return { data, error, newFileName }
    };

    const getSignedUrl = async (path, expiresIn) => {
        const { data, error } = await supabase.storage
            .from('user-upload-files')
            .createSignedUrl(path, expiresIn);

        if (error) {
            throw error;
        }

        return data.signedUrl;
    };


    const handleFileUpload = async (fileSelected) => {
        try {
            if (!fileSelected) {
                throw new Error('No file selected');
            }
            setuploadingPDF(true);
            // const fileType = getFileType(fileSelected);
            var { data, error, newFileName } = await uploadFileToSupabase(fileSelected);
            setfileName(newFileName);
            setTitle(newFileName);
            const fileSelectedUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${newFileName}`;

            const expiresIn = 60 * 60; // 1 hour
            const signedUrl = await getSignedUrl(`${customer.user_id}/${newFileName}`, expiresIn);
            setPdfUrl(signedUrl);
            showSnackbar("File uploaded successfully");
            setuploadingPDF(false);
            setUploaded(true);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const fileType = "pdf"
    const handlePDFIndexing = async () => {
        // make call to /api/process-pdf with pdfUrl, user_id, bot_id
        setindexing(true);
        setError('');
        // check if we have pdfUrl and make sure is is url for a pdf hosted file via regex  or is supabase storage url like https://____.supabase.co/storage/v1/object/sign/______/9865741b-67d4-4062-be29-6f327cc02919/5yru-infinite-uploads.pdf?token=eyJ.....P4fXc check with supabase.co/storage
        if (!pdfUrl) {
            setError('Please upload a PDF file');
            setindexing(false);
            return;
        }

        if (!pdfUrl.match(/^(http|https):\/\/.*\.(pdf)$/) && !pdfUrl.match(/^(http|https):\/\/.*\.(supabase.co\/storage\/v1\/object\/sign\/.*)$/)) {
            setError('Please upload a PDF file');
            setindexing(false);
            return;
        }

        try {
            const response = await axios.post('/api/process-pdf', {
                pdfUrl: pdfUrl,
                user_id: customer.user_id,
                bot_id: botInfo.bot_id,
                fileName: fileName
            });

            if (response.status === 200) {
                console.log('PDF processed successfully');
                // setPdfText(JSON.stringify(response.data));
            } else {
                console.error('An error occurred while processing the PDF');
                setError('An error occurred while processing the PDF');
            }
        } catch (error) {
            console.error('Error processing the PDF:', error);
            setError('Error processing the PDF');
        }
        setindexing(false);
        hideAddSourceOptions();
        window.location.reload();
    }

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const fetchPdfText = async () => {
        setindexing(true);
        setError('');
        try {
            const response = await axios.post('/api/process-pdf', { pdfUrl, user_id: customer.user_id, bot_id: botInfo.bot_id });

            if (response.status === 200) {
                console.log('PDF processed successfully');
                // setPdfText(JSON.stringify(response.data));
            } else {
                console.error('An error occurred while processing the PDF');
                setError('An error occurred while processing the PDF');
            }
        } catch (error) {
            console.error('Error processing the PDF:', error);
            setError('Error processing the PDF');
        }
        setindexing(false);
        hideAddSourceOptions();
    };

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     fetchPdfText();
    // };

    return (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="col mt-6 text-sm text-gray-600">
                <p className="text-md text-gray-500 mb-3 px-3">
                    Upload a document file containing text to learn from. Some examples are product documentation, research papers, employee handbooks, an ebook, or any content you can convert to a text file. We will parse the content, and add it to this bot.
                </p>
            </div>
            <div className="col">
                <div>
                    <div className="mb-4 flex flex-col">
                        <div className="flex justify-between">
                            <label
                                htmlFor="url"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Source URL
                            </label>
                            <span className="text-sm capitalize text-gray-500">optional</span>
                        </div>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                                type="url"
                                name="url"
                                onChange={(e) => setsourceURL(e.target.value)}
                                id="url"
                                value={sourceURL}
                                className="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                                placeholder="https://example.com/sample.pdf"
                                aria-describedby="url-description"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="flex justify-between">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Source title
                            </label>
                            <span className="text-sm capitalize text-gray-500">Required</span>
                        </div>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="title"
                                onChange={(e) => setTitle(e.target.value)}
                                id="title"
                                value={title}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                                aria-describedby="title-description"
                            />
                        </div>
                        <p className="mt-2 text-sm font-light text-gray-500" id="title-description">
                            Title of source displayed alongside answers. Defaults to page title
                            or file name.
                        </p>
                    </div>
                    <div className="flex justify-between w-full">
                        <div className='flex flex-col w-full'>
                            <div className="flex justify-between">
                                <label
                                    htmlFor="file"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Source File
                                </label>
                                <span className="text-sm capitalize text-gray-500">required</span>
                            </div>
                            <input
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                accept="application/pdf"
                                type="file" />
                            {!file && <button
                                type="button"
                                onClick={handleButtonClick}
                                className="mt-2 relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none"
                            >
                                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-300 pointer-events-none"
                                    aria-hidden="true" />
                                <span className="mt-2 block text-sm text-gray-500">Upload your source file</span>
                            </button>}

                            {file &&
                                // rectangle with pin icon in the left and uploading 50% percentage in the right, when done showing check icon in the right with hero icons
                                <div className="mt-2 flex justify-between p-4 items-center border-2 border-dashed border-gray-300 rounded-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="mr-4 h-5 w-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                                    <span className="flex items-center text-sm text-gray-500">  {uploadingPDF && <Spinner />} {uploadingPDF ? `Uploading...` : fileName} {uploaded && <CheckCircleIcon className='h-5 w-5 ml-2' />} </span>
                                </div>
                            }
                            <div className="relative mt-6">
                                <div
                                    className="absolute inset-0 flex items-center"
                                    aria-hidden="true"
                                >
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white px-2 text-gray-500">
                                        Or
                                    </span>
                                </div>
                            </div>
                            <div className="mb-4 flex flex-col">
                                <div className="mt-2 flex justify-between">
                                    <label
                                        htmlFor="url"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Hosted PDF URL
                                    </label>
                                    <span className="text-xs capitalize text-gray-500">required</span>
                                </div>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <input
                                        type="url"
                                        name="url"
                                        onChange={(e) => setPdfUrl(e.target.value)}
                                        id="url"
                                        value={pdfUrl}
                                        className="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                                        placeholder="https://example.com/sample.pdf"
                                        aria-describedby="url-description"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 mb-2 flex flex-shrink-0 items-end justify-end">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        hideAddSourceOptions();
                                    }}
                                    className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-75"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePDFIndexing()
                                    }}>
                                    {!indexing && <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                        className="-ml-1 mr-2 h-6 w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </svg>}
                                    {indexing ? "Indexing..." : "Add source"}
                                </button>
                                {/* {pdfText && (
                            <div>
                                <h3>Extracted Text:</h3>
                                <pre>{pdfText}</pre>
                            </div>
                        )} */}
                            </div>
                            {error && <p className='text-red-500 text-sm text-right'>
                                Error: {error}</p>}
                        </div >
                    </div>
                </div>
            </div>
        </div>
    )
}

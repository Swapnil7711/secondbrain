import { deleteSource } from '@/supabase/tables'
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import { showSnackbar } from '@/utils';
import { UserContext } from '@/contexts/user-context';


export function SourceInfo({ source }) {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`/api/content-by-source-id?id=${source.source_id}`);
                // setContent(response.data);
                const allContent = response.data.map(item => item.content).join('');
                setContent(allContent);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [source.source_id])

    return (
        <div>
            <h2 className="text-lg font-medium text-gray-900">
                Source Info</h2>
            <p className="text-sm my-2">
                Source ID: {source.source_id}
            </p>
            <p className="text-sm my-2 truncate">
                {source.url}</p>
            {error && <p>Error: {error}</p>}
            {<p
                className="mt-3 h-36 border border-gray-400 rounded overflow-y-scroll bg-gray-100 text-sm p-2 font-normal">
                {content ? content : loading ? `Loading...` : `No content found for this source.`}
            </p>}
        </div>
    )
}


export default function SourceListTile({ source, bot_id }) {
    // Add this state to control the visibility of the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleting, setdeleting] = useState(false)
    const [customer, setCustomer] = useContext(UserContext).customer;

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    async function deleteIndexedContent(url: string, userId: string): Promise<boolean> {
        setdeleting(true);
        try {
            const response = await axios.delete('/api/delete-indexed-content', {
                params: { url, user_id: userId },
            });

            if (response.status === 200) {
                setdeleting(false);
                setIsModalOpen(false);
                // reload page
                window.location.reload();
                return response.data.success;
            } else {
                setdeleting(false);
                throw new Error(`Request failed with status code ${response.status}`);
            }
        } catch (error) {
            setdeleting(false);
            console.error('Error deleting indexed content:', error);
            return false;
        }
    }

    const handleDeleteContent = async (url, userId) => {
        const success = await deleteIndexedContent(url, userId);

        if (success) {
            // setResult('Successfully deleted indexed content.');
            showSnackbar('Successfully deleted indexed content.');
        } else {
            // setResult('Failed to delete indexed content.');
            showSnackbar('Failed to delete indexed content.');
        }
    };

    return (
        <li key={source.name} className="col-span-1 flex rounded-md shadow-sm"
            onClick={() => setIsModalOpen(true)} // Add this to open the modal on click
        >
            {/* <div
                className={classNames(
                    project.bgColor,
                    'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
                )}
            >
                {project.initials}
            </div> */}
            <div className="flex flex-1 justify-between truncate rounded-md border border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                    <div className='my-1'>
                        <a href={source.href} className="font-medium text-gray-900 hover:text-gray-600">
                            {source.type}
                        </a> {
                            source.is_indexed ? (
                                <span
                                    className="ml-2 px-2.5 text-xs inline-flex items-center rounded-full bg-green-100 font-medium text-green-800 py-1">
                                    Indexed
                                </span>
                            ) : (
                                <span
                                    className="ml-2 px-2.5 text-xs inline-flex items-center rounded-full bg-red-100 font-medium text-red-800 py-1">
                                    Failed
                                </span>
                            )
                        }
                    </div>
                    <p style={{
                        whiteSpace: "break-spaces"
                    }} className="my-2 text-gray-500 text-xs line-clamp-2">{source.url}</p>
                </div>
            </div>

            <Transition show={isModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={() => setIsModalOpen(false)}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        <span className="inline-block h-screen align-middle" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <SourceInfo source={source} />
                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setIsModalOpen(false)
                                        }}
                                    >
                                        Close
                                    </button>
                                    {/* Add Delete content button */}
                                    <button
                                        type="button"
                                        disabled={deleting}
                                        className={`ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 ${deleting ? 'cursor-not-allowed' : ''}`}
                                        onClick={() => {
                                            console.log(`trying to delete ${source.url} from ${source.bot_id}`)
                                            handleDeleteContent(source.url, customer.user_id)
                                        }}
                                    >
                                        {deleting ? (`Deleting...`) : (`Delete Source`)}
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </li>
    )
}

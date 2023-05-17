import { XMarkIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export default function Banner() {
    return (
        <div className="flex items-center gap-x-6 bg-gray-900 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
            <p className="text-sm leading-6 text-white">
                <p>
                    {/* <strong className="font-semibold">Ult</strong>
                    <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                        <circle cx={1} cy={1} r={1} />
                    </svg> */}
                    Launch offer - Use coupon code “Launch50” to get a 50% off <Link href="/pricing" className="font-semibold text-white underline">check pricing</Link>
                </p>
            </p>
            <div className="flex flex-1 justify-end">
                <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
                </button>
            </div>
        </div>
    )
}

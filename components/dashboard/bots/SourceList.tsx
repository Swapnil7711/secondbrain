import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import SourceListTile from './SourceListTile'

// const projects = [
//     { name: 'URL', url: 'https://www.blurscreen.app', is_indexed: true },
// ]

export default function SourceList({ sources, bot_id }) {
    return (
        <div>
            {/* <h2 className="text-sm font-medium text-gray-500">Pinned Projects</h2> */}
            <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {sources?.map((source) => (
                    <SourceListTile key={source.name} bot_id={bot_id} source={source} />
                ))}
            </ul>
        </div>
    )
}

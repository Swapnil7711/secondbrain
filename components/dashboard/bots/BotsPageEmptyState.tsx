import { PlusIcon } from "@heroicons/react/20/solid";

export default function BotsPageEmptyState({ showAddSource, botInfo }) {
  return (
    <div className="text-center">
      {/* logo */}
      {/* <PlusIcon className="mx-auto h-12 w-auto" aria-hidden="true" /> */}
      <h3 className="mt-6 text-md font-medium text-gray-900">Add Source</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
        {`Add source content to ${botInfo?.name} that you want your bot to be able to answer questions about. Don't index the same content multiple times. Periodic scheduled source updates are coming soon for pro plans.`}
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => showAddSource()}
          className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Source
        </button>
      </div>
    </div>
  );
}

import { PlusIcon } from "@heroicons/react/20/solid";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function BotsEmptyState({ bots, customer, showAdd }) {

  function checkIfCanAdd() {
    console.log(`checkIfCanAdd: ${customer?.plan}`);
    switch (customer?.plan) {
      case "free":
        console.log(`checkIfCanAdd: ${bots?.length}`);
        if (bots?.length > 0) {
          return false;
        } else if (bots?.length === 0) {
          return true;
        }
      case "hobby":
        if (bots?.length >= 3) {
          return false;
        } else {
          return true;
        }
      case "power":
        if (bots?.length >= 10) {
          return false;
        } else {
          return true;
        }
      case "pro":
        if (bots?.length >= 100) {
          return false;
        } else {
          return true;
        }
      default:
        break;
    }
  }

  return (
    <div className="text-center mt-10">
      {/* logo */}
      <img
        src="/assets/logo.svg"
        className="mx-auto h-12 w-auto"
        alt="SecondBrain.fyi"
      />
      <h3 className="mt-2 text-md font-medium text-gray-900">
        Add SecondBrain Bot
      </h3>
      <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
        Use your webpages, documentations and content to train a new AnswerBot
        from scratch.
      </p>
      <div className="mt-6">
        {checkIfCanAdd() ? <button
          type="button"
          onClick={() => showAdd()}
          className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New SecondBrain Bot
        </button> : <Link href="/pricing"
          className="ml-2 inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
          Upgrade to Add New Bot
        </Link>}
      </div>
    </div>
  );
}

import { timeAgo } from "@/utils";
import { CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/20/solid";
import { EyeIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline";

export default function BotsListTile({ bots }) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {bots.map((bot) => (
          <li key={bot.id}>
            <a href={`/app/bots/${bot.bot_id}`} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {bot.name}
                  </p>
                  {/* <div className="ml-2 flex flex-shrink-0">
                    {bot.is_active ? (
                      <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Active
                      </p>
                    ) : (
                      <p className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                        Awaiting Sources
                      </p>
                    )}
                  </div> */}
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <EyeIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        Public
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        last updated:
                        {"  " + timeAgo(bot.last_updated)}
                      </div>
                      {/* <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Square3Stack3DIcon
                          className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                      0 Sources
                      </div> */}
                      {/* <div className="mt-2 flex items-center text-sm text-gray-500">
                        <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        Closing on January 9, 2020
                    </div> */}
                    </div>
                    {/* <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                            <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            {position.location}
                                        </p> */}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    {/* <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" /> */}
                    {/* <p>
                                            Closing on
                                        </p> */}
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

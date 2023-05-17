import { Fragment, useContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { UserContext } from "../../../contexts/user-context";
import { serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { showSnackbar } from "../../../utils";
import { uploadBotInfo } from "@/supabase/tables";
import { v4 as uuidv4 } from 'uuid';

export default function AddBotSidebar({ open, setOpen }) {
  var router = useRouter();
  const [customer, setCustomer] = useContext(UserContext).customer;
  const [botName, setbotName] = useState("");
  const [botDescription, setbotDescription] = useState("");
  const [loading, setloading] = useState(false);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-gray-800 py-6 px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Create a new AnswerBot
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-gray-900 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-300">
                            Get started by filling in the information below to
                            create your new project.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pt-6 pb-5">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Name
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="project-name"
                                  id="project-name"
                                  onChange={(e) => setbotName(e.target.value)}
                                  placeholder="what would you like to call your bot?"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Description
                              </label>
                              <div className="mt-2">
                                <textarea
                                  id="description"
                                  name="description"
                                  rows={4}
                                  onChange={(e) =>
                                    setbotDescription(e.target.value)
                                  }
                                  placeholder={`Provide a description of your bot's intended functionality and usage, such as 'Ask me any questions about my product!'`}
                                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                            <fieldset>
                              <legend className="text-sm font-medium leading-6 text-gray-900">
                                Privacy
                              </legend>
                              <div className="mt-2 space-y-4">
                                <div className="relative flex items-start">
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id="privacy-public"
                                      name="privacy"
                                      aria-describedby="privacy-public-description"
                                      type="radio"
                                      className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
                                      defaultChecked
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor="privacy-public"
                                      className="font-medium text-gray-900"
                                    >
                                      Public access
                                    </label>
                                    <p
                                      id="privacy-public-description"
                                      className="text-gray-500"
                                    >
                                      Allows for embedding on the frontend of
                                      websites.
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start opacity-50">
                                    <div className="absolute flex h-6 items-center">
                                      <input
                                        id="privacy-private"
                                        name="privacy"
                                        aria-describedby="privacy-private-to-project-description"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
                                        disabled
                                      />
                                    </div>
                                    <div className="pl-7 text-sm leading-6">
                                      <label
                                        htmlFor="privacy-private"
                                        className="font-medium text-gray-900"
                                      >
                                        Private (coming soon)
                                      </label>
                                      <p
                                        id="privacy-private-description"
                                        className="text-gray-500"
                                      >
                                        Authenticated API access only. Good for
                                        internal company content.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                          {/* <div className="pt-4 pb-6">
                                                        <div className="flex text-sm">
                                                            <a
                                                                href="#"
                                                                className="group inline-flex items-center font-medium text-gray-600 hover:text-gray-900"
                                                            >
                                                                <LinkIcon
                                                                    className="h-5 w-5 text-gray-500 group-hover:text-gray-900"
                                                                    aria-hidden="true"
                                                                />
                                                                <span className="ml-2">Copy link</span>
                                                            </a>
                                                        </div>
                                                        <div className="mt-4 flex text-sm">
                                                            <a href="#" className="group inline-flex items-center text-gray-500 hover:text-gray-900">
                                                                <QuestionMarkCircleIcon
                                                                    className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                                    aria-hidden="true"
                                                                />
                                                                <span className="ml-2">Learn more about sharing</span>
                                                            </a>
                                                        </div>
                                                    </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={customer === null || loading}
                        onClick={async (e) => {
                          e.preventDefault();
                          // set the label of this button to creating...
                          console.log("creating bot", customer.uid);
                          setloading(true);
                          var bot_id = uuidv4();
                          var uploadResponse = await uploadBotInfo(
                            customer.user_id,
                            {
                              name: botName,
                              description: botDescription,
                              is_private: false,
                              last_updated: new Date().toISOString(),
                              language: "en",
                              is_active: false,
                              bot_id: bot_id,
                              base_prompt: `I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given text. If the answer is not included in the text, say exactly "Hmm, I am not sure." and stop after that. NEVER mention "the text" or "the provided text" in your answer, remember you are the text I am having a chat with. Refuse to answer any question not about the text. Never break character.`,
                              model: "gpt-3.5-turbo"
                            }
                          );
                          setloading(false);
                          if (uploadResponse.success) {
                            router.push(`/app/bots/${bot_id}`);
                          } else {
                            console.log(uploadResponse);
                            showSnackbar(uploadResponse.error);
                          }
                        }}
                        className="ml-4 inline-flex justify-center rounded-md bg-gray-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      >
                        {loading ? "Creating..." : "Create SecondBrain Bot"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

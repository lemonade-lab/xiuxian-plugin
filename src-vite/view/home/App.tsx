import React from 'react'

export default function App() {
  return (
    <>
      <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64 dark:bg-neutral-800 dark:border-neutral-700">
        <nav className="flex basis-full items-center w-full mx-auto px-4 sm:px-6">
          <div className=" lg:me-0 lg:hidden">修仙之练气十万年</div>

          <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
            <div className="sm:hidden">
              <button
                type="button"
                className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>

            <div className="hidden sm:block">
              <label className="sr-only">Search</label>
              <div className="relative min-w-72 md:min-w-80">
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                  <svg
                    className="flex-shrink-0 size-4 text-gray-400 dark:text-neutral-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  className="py-2 px-4 ps-11 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Search"
                />
              </div>
            </div>

            <div className="flex flex-row items-center justify-end gap-2">
              <button
                type="button"
                className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </button>
              <button
                type="button"
                className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </button>

              <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
                <button
                  id="hs-dropdown-with-header"
                  type="button"
                  className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                >
                  <img
                    className="inline-block size-[38px] rounded-full ring-2 ring-white dark:ring-neutral-800"
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                    alt="Image Description"
                  />
                </button>

                <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-900 dark:border dark:border-neutral-700">
                  <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-neutral-800">
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      Signed in as
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
                      james@site.com
                    </p>
                  </div>
                  <div className="mt-2 py-2 first:pt-0 last:pb-0">
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                      href="#"
                    >
                      <svg
                        className="flex-shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                      Newsletter
                    </a>
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                      href="#"
                    >
                      <svg
                        className="flex-shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      Purchases
                    </a>
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                      href="#"
                    >
                      <svg
                        className="flex-shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                        <path d="M12 12v9" />
                        <path d="m8 17 4 4 4-4" />
                      </svg>
                      Downloads
                    </a>
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                      href="#"
                    >
                      <svg
                        className="flex-shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      Team Account
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 md:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex justify-between items-center py-2">
          <ol className="ms-3 flex items-center whitespace-nowrap">
            <li className="flex items-center text-sm text-gray-800 dark:text-neutral-400">
              Application Layout
              <svg
                className="flex-shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                  stroke="currentColor"
                />
              </svg>
            </li>
            <li
              className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
              aria-current="page"
            >
              Dashboard
            </li>
          </ol>
          <button
            type="button"
            className="py-2 px-3 flex justify-center items-center gap-x-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:text-gray-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <svg
              className="flex-shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M17 8L21 12L17 16M3 12H13M3 6H13M3 18H13" />
            </svg>
            <span className="sr-only">Sidebar</span>
          </button>
        </div>
      </div>
      <div
        id="application-sidebar"
        className="hs-overlay [--auto-close:lg]
  hs-overlay-open:translate-x-0
  -translate-x-full transition-all duration-300 transform
  w-[260px]
  hidden
  fixed inset-y-0 start-0 z-[60]
  bg-white border-e border-gray-200
  lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
  dark:bg-neutral-800 dark:border-neutral-700
 "
      >
        <div className="px-8 pt-4">修仙之练气十万年</div>

        <nav className="hs-accordion-group p-6 w-full flex flex-col flex-wrap">
          <ul className="space-y-1.5">
            <li>
              <a
                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white"
                href="#"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Dashboard
              </a>
            </li>

            <li className="hs-accordion" id="users-accordion">
              <button
                type="button"
                className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Users
                <svg
                  className="hs-accordion-active:block ms-auto hidden size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
                <svg
                  className="hs-accordion-active:hidden ms-auto block size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                id="users-accordion-child"
                className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
              >
                <ul className="hs-accordion-group ps-3 pt-2">
                  <li className="hs-accordion" id="users-accordion-sub-1">
                    <button
                      type="button"
                      className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
                    >
                      Sub Menu 1
                      <svg
                        className="hs-accordion-active:block ms-auto hidden size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                      <svg
                        className="hs-accordion-active:hidden ms-auto block size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div
                      id="users-accordion-sub-1-child"
                      className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                    >
                      <ul className="pt-2 ps-2">
                        <li>
                          <a
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                            href="#"
                          >
                            Link 1
                          </a>
                        </li>
                        <li>
                          <a
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                            href="#"
                          >
                            Link 2
                          </a>
                        </li>
                        <li>
                          <a
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                            href="#"
                          >
                            Link 3
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="hs-accordion" id="users-accordion-sub-2">
                    <button
                      type="button"
                      className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
                    >
                      Sub Menu 2
                      <svg
                        className="hs-accordion-active:block ms-auto hidden size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                      <svg
                        className="hs-accordion-active:hidden ms-auto block size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div
                      id="users-accordion-sub-2-child"
                      className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden ps-2"
                    >
                      <ul className="pt-2 ps-2">
                        <li>
                          <a
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                            href="#"
                          >
                            Link 1
                          </a>
                        </li>
                        <li>
                          <a
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                            href="#"
                          >
                            Link 2
                          </a>
                        </li>
                        <li>
                          <a
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                            href="#"
                          >
                            Link 3
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>

            <li className="hs-accordion" id="account-accordion">
              <button
                type="button"
                className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
              >
                <svg
                  className="flex-shrink-0 mt-0.5 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="18" cy="15" r="3" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                  <path d="m21.7 16.4-.9-.3" />
                  <path d="m15.2 13.9-.9-.3" />
                  <path d="m16.6 18.7.3-.9" />
                  <path d="m19.1 12.2.3-.9" />
                  <path d="m19.6 18.7-.4-1" />
                  <path d="m16.8 12.3-.4-1" />
                  <path d="m14.3 16.6 1-.4" />
                  <path d="m20.7 13.8 1-.4" />
                </svg>
                Account
                <svg
                  className="hs-accordion-active:block ms-auto hidden size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
                <svg
                  className="hs-accordion-active:hidden ms-auto block size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                id="account-accordion-child"
                className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
              >
                <ul className="pt-2 ps-2">
                  <li>
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                      href="#"
                    >
                      Link 1
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                      href="#"
                    >
                      Link 2
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                      href="#"
                    >
                      Link 3
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li className="hs-accordion" id="projects-accordion">
              <button
                type="button"
                className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hs-accordion-active:text-white"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Projects
                <svg
                  className="hs-accordion-active:block ms-auto hidden size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
                <svg
                  className="hs-accordion-active:hidden ms-auto block size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                id="projects-accordion-child"
                className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
              >
                <ul className="pt-2 ps-2">
                  <li>
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                      href="#"
                    >
                      Link 1
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                      href="#"
                    >
                      Link 2
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300"
                      href="#"
                    >
                      Link 3
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <a
                className="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                href="#"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                  <path d="M8 14h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 18h.01" />
                  <path d="M12 18h.01" />
                  <path d="M16 18h.01" />
                </svg>
                Calendar
              </a>
            </li>
            <li>
              <a
                className="w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-300"
                href="#"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Documentation
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="w-full lg:ps-64">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Total users
                  </p>
                  <div className="hs-tooltip">
                    <div className="hs-tooltip-toggle">
                      <svg
                        className="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                      <span
                        className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700"
                        role="tooltip"
                      >
                        The number of daily users
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    72,540
                  </h3>
                  <span className="flex items-center gap-x-1 text-green-600">
                    <svg
                      className="inline-block size-4 self-center"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                      <polyline points="16 7 22 7 22 13" />
                    </svg>
                    <span className="inline-block text-sm">1.7%</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Sessions
                  </p>
                </div>

                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    29.4%
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Avg. Click Rate
                  </p>
                </div>

                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    56.8%
                  </h3>
                  <span className="flex items-center gap-x-1 text-red-600">
                    <svg
                      className="inline-block size-4 self-center"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                      <polyline points="16 17 22 17 22 11" />
                    </svg>
                    <span className="inline-block text-sm">1.7%</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-x-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    Pageviews
                  </p>
                </div>

                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    92,913
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 md:p-5 min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                    Income
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    $126,238.49
                  </p>
                </div>

                <div>
                  <span className="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-500">
                    <svg
                      className="inline-block size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M12 5v14" />
                      <path d="m19 12-7 7-7-7" />
                    </svg>
                    25%
                  </span>
                </div>
              </div>

              <div id="hs-multiple-bar-charts"></div>
            </div>

            <div className="p-4 md:p-5 min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-sm text-gray-500 dark:text-neutral-500">
                    Visitors
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                    80.3k
                  </p>
                </div>

                <div>
                  <span className="py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500">
                    <svg
                      className="inline-block size-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M12 5v14" />
                      <path d="m19 12-7 7-7-7" />
                    </svg>
                    2%
                  </span>
                </div>
              </div>

              <div id="hs-single-area-chart"></div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                  <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                        Users
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        Add users, edit and more.
                      </p>
                    </div>

                    <div>
                      <div className="inline-flex gap-x-2">
                        <a
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                          href="#"
                        >
                          View all
                        </a>

                        <a
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                          href="#"
                        >
                          <svg
                            className="flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                          Add user
                        </a>
                      </div>
                    </div>
                  </div>

                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead className="bg-gray-50 dark:bg-neutral-800">
                      <tr>
                        <th scope="col" className="ps-6 py-3 text-start">
                          <label className="flex">
                            <input
                              type="checkbox"
                              className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                              id="hs-at-with-checkboxes-main"
                            />
                            <span className="sr-only">Checkbox</span>
                          </label>
                        </th>

                        <th
                          scope="col"
                          className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                        >
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Name
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Position
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Status
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Portfolio
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Created
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-end"></th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-1"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <img
                                className="inline-block size-[38px] rounded-full"
                                src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                                alt="Image Description"
                              />
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Christina Bersh
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  christina@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Director
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              Human resources
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                              Active
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                1/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{
                                    width: '25%'
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              28 Dec, 12:12
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-2"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <img
                                className="inline-block size-[38px] rounded-full"
                                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                                alt="Image Description"
                              />
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  David Harrison
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  david@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Seller
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              Branding products
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
                              Warning
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                3/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{
                                    width: '78%'
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              20 Dec, 09:27
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-3"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="inline-flex items-center justify-center size-[38px] rounded-full bg-white border border-gray-300 dark:bg-neutral-800 dark:border-neutral-700">
                                <span className="font-medium text-sm text-gray-800 leading-none dark:text-neutral-200">
                                  A
                                </span>
                              </span>
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Anne Richard
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  anne@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Designer
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              IT department
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                              Active
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                5/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{
                                    width: '100%'
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              18 Dec, 15:20
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-4"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <img
                                className="inline-block size-[38px] rounded-full"
                                src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80"
                                alt="Image Description"
                              />
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Samia Kartoon
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  samia@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Executive director
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              Marketing
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                              Active
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                0/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{ width: '1%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              18 Dec, 15:20
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-5"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="inline-flex items-center justify-center size-[38px] rounded-full bg-white border border-gray-300 dark:bg-neutral-800 dark:border-neutral-700">
                                <span className="font-medium text-sm text-gray-800 leading-none dark:text-neutral-200">
                                  D
                                </span>
                              </span>
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  David Harrison
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  david@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Developer
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              Mobile app
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
                              Danger
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                3/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{ width: '78%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              15 Dec, 14:41
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-6"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <img
                                className="inline-block size-[38px] rounded-full"
                                src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                                alt="Image Description"
                              />
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Brian Halligan
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  brian@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Accountant
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              Finance
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                              Active
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                2/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{ width: '40%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              11 Dec, 18:51
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-7"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <img
                                className="inline-block size-[38px] rounded-full"
                                src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                                alt="Image Description"
                              />
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Andy Clerk
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  andy@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Director
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              Human resources
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                              Active
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                1/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{ width: '25%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              28 Dec, 12:12
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-8"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <img
                                className="inline-block size-[38px] rounded-full"
                                src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                                alt="Image Description"
                              />
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Bart Simpson
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  Bart@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Seller
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              Branding products
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
                              Warning
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                3/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{ width: '78%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              20 Dec, 09:27
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-9"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="inline-flex items-center justify-center size-[38px] rounded-full bg-white border border-gray-300 dark:bg-neutral-800 dark:border-neutral-700">
                                <span className="font-medium text-sm text-gray-800 leading-none dark:text-neutral-200">
                                  C
                                </span>
                              </span>
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Camila Welters
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  cwelt@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Designer
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              IT department
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                              Active
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                5/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{ width: '100%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              18 Dec, 15:20
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-10"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <img
                                className="inline-block size-[38px] rounded-full"
                                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                                alt="Image Description"
                              />
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Oliver Schevich
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  oliver@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Seller
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              Branding products
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
                              Warning
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                3/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{ width: '78%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              20 Dec, 09:27
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-11"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="inline-flex items-center justify-center size-[38px] rounded-full bg-white border border-gray-300 dark:bg-neutral-800 dark:border-neutral-700">
                                <span className="font-medium text-sm text-gray-800 leading-none dark:text-neutral-200">
                                  I
                                </span>
                              </span>
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Inna Ivy
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  invy@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Designer
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              IT department
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                              Active
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                5/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{ width: '100%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              18 Dec, 15:20
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 py-3">
                            <label className="flex">
                              <input
                                type="checkbox"
                                className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                id="hs-at-with-checkboxes-12"
                              />
                              <span className="sr-only">Checkbox</span>
                            </label>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <img
                                className="inline-block size-[38px] rounded-full"
                                src="https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                                alt="Image Description"
                              />
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                  Jessica Williams
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                  myhairisred@site.com
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              Executive director
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-neutral-500">
                              Marketing
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              <svg
                                className="size-2.5"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                              Active
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <div className="flex items-center gap-x-3">
                              <span className="text-xs text-gray-500 dark:text-neutral-500">
                                0/5
                              </span>
                              <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700">
                                <div
                                  className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-neutral-200"
                                  role="progressbar"
                                  style={{ width: '1%' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3">
                            <span className="text-sm text-gray-500 dark:text-neutral-500">
                              18 Dec, 15:20
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-1.5">
                            <a
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500"
                              href="#"
                            >
                              Edit
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        <span className="font-semibold text-gray-800 dark:text-neutral-200">
                          12
                        </span>{' '}
                        results
                      </p>
                    </div>

                    <div>
                      <div className="inline-flex gap-x-2">
                        <button
                          type="button"
                          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                        >
                          <svg
                            className="flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                          Prev
                        </button>

                        <button
                          type="button"
                          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                        >
                          Next
                          <svg
                            className="flex-shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

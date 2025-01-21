"use client";

import { Dialog } from "@headlessui/react";
import { Link } from "react-router-dom";

export default function PopOver({ onClose, message,status,hotel_name }) {
  return (
    <Dialog open={true} onClose={onClose} className="relative z-10">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      {console.log(message)}

      {/* Dialog Container */}
      <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
            {/* Dialog Content */}
            <div className="bg-white px-6 py-6 sm:p-8">
              <div className="sm:flex sm:items-start">
                {/* Content goes here */}
                <div className="flex flex-col items-center justify-center">
                  {/* Image */}
                  {message?.image && (
                    <div>
                      <img
                        className="w-full object-contain mb-0"
                        src={message.image}
                        alt="No image found"
                      />
                      <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl">
                        scan for booking
                      </p>
                    </div>
                  )}
                  {/* Message */}
                  {message?.message && (
                    <p className="text-sm text-gray-500 text-center">
                      {message.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
              {status === "Open" ? (
                <Link to= {'/hotel-book/'+hotel_name}>
                  <button className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                    Book here
                  </button>
                </Link>
              ) : (
                ""
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

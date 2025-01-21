import { useCallback, useEffect, useState } from "react";
import PopOver from "../popovers/PopOver";
import BookHotel from "./BookHotel";

export default function HotelInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const hotel_name = urlParams.get("name");

  const [hotelInfo, setHotelInfo] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [message, setMessage] = useState({});
  const fetchData = useCallback(async () => {
    fetch(`http://localhost:3000/api/v1/hotel/show-this-hotel/${hotel_name}`)
      .then((res) => res.json())
      .then((res) => setHotelInfo(res.data))
      .catch((err) => console.log("error while fetching hotel info: ", err));
  }, []);

    const bookButton = () => {
      console.log(hotelInfo?.qrcode);
    if (hotelInfo?.hotel?.hotelStatus !== "Open") {
      setMessage({ message: "Hotel booking is not available" });
    } else {
      setMessage({ image: hotelInfo?.qrcode });
    }
    setDialog(true);
    return <BookHotel />;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Your content */}

        {/* <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              {hotelInfo.hotel?.name}
            </h1>
          </div>
        </header> */}

        {console.log(hotelInfo)}
        <main className="py-6 px-4 sm:p-6 md:py-10 md:px-8 ">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:max-w-5xl lg:gap-x-20 lg:grid-cols-2">
            <div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 sm:bg-none sm:row-start-2 sm:p-0 lg:row-start-1">
              <h1 className="mt-1 text-lg font-semibold text-white sm:text-slate-900 md:text-2xl dark:sm:text-black">
                {hotelInfo.hotel?.name}
              </h1>
              <p className="text-sm leading-4 font-medium text-white sm:text-slate-500 dark:sm:text-slate-400">
                {hotelInfo.hotel?.hotelStatus}
              </p>
            </div>
            <div className="grid gap-4 col-start-1 col-end-3 row-start-1 sm:mb-6 sm:grid-cols-4 lg:gap-6 lg:col-start-2 lg:row-end-6 lg:row-span-6 lg:mb-0">
              {hotelInfo.hotel?.logo ? (
                <img
                  src={hotelInfo.hotel?.logo}
                  alt="No imgage found"
                  className="w-full h-auto object-cover rounded-lg sm:col-span-4 lg:col-span-full"
                  loading="lazy"
                />
              ) : (
                <p className="col-span-4 text-center text-gray-500">
                  No images available for this hotel.
                </p>
              )}
            </div>

            <dl className="mt-4 text-xs font-medium flex items-center row-start-2 sm:mt-1 sm:row-start-3 md:mt-2.5 lg:row-start-2">
              <dt className="sr-only">Reviews</dt>
              <dd className="text-indigo-600 flex items-center dark:text-indigo-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  aria-hidden="true"
                  className="mr-1 stroke-current dark:stroke-indigo-500"
                >
                  <path
                    d="M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-7 16c0-4 3-7 7-7s7 3 7 7H5Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span>
                  {hotelInfo.hotel?.guestCount}{" "}
                  <span className="text-slate-400 font-normal"></span>
                </span>
              </dd>
              <dt className="sr-only">Location</dt>
              <dd className="flex items-center">
                <svg
                  width="2"
                  height="2"
                  aria-hidden="true"
                  fill="currentColor"
                  className="mx-3 text-slate-300"
                >
                  <circle cx="1" cy="1" r="1" />
                </svg>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 text-slate-400 dark:text-slate-500"
                  aria-hidden="true"
                >
                  <path d="M18 11.034C18 14.897 12 19 12 19s-6-4.103-6-7.966C6 7.655 8.819 5 12 5s6 2.655 6 6.034Z" />
                  <path d="M14 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                </svg>
                {hotelInfo.hotel?.address}
              </dd>
            </dl>
            <div className="mt-4 col-start-1 row-start-3 self-center sm:mt-0 sm:col-start-2 sm:row-start-2 sm:row-span-2 lg:mt-6 lg:col-start-1 lg:row-start-3 lg:row-end-4">
              <button
                type="button"
                className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={bookButton}
              >
                {hotelInfo.hotel?.hotelStatus === "Open"
                  ? `Bookings ${hotelInfo.hotel?.hotelStatus?.toLowerCase()}`
                  : hotelInfo.hotel?.hotelStatus}

                {dialog && (
                  <PopOver
                    onClose={() => setDialog(false)}
                    message={message}
                    status={hotelInfo.hotel?.hotelStatus}
                    hotel_name={hotelInfo.hotel?.name}
                  />
                )}
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 col-start-1 sm:col-span-2 lg:mt-6 lg:row-start-4 lg:col-span-1 dark:text-slate-400">
              This sunny and spacious room is for those traveling light and
              looking for a comfy and cosy place to lay their head for a night
              or two. This beach house sits in a vibrant neighborhood littered
              with cafes, pubs, restaurants and supermarkets and is close to all
              the major attractions such as Edinburgh Castle and Arthur's Seat.
            </p>
          </div>
        </main>
        {/*  */}
      </div>
    </>
  );
}

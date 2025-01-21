import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function ShowGuests() {
  const [hotelArray, setHotelArray] = useState([]);
  const [guestArray, setGuestArray] = useState([]);
  const [guestStatus, setGuestStatus] = useState({});
  const [afterStatus, setAfterStatus] = useState({});
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  let hotel_name = urlParams.get("name");

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/admin/my-profile`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (
          res.message === "Unauthorized request" ||
          res?.data?.role !== "guest-admin"
        ) {
          navigate("/no-page-found");
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/v1/hotel/show-hotel-guests/${hotel_name}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res?.status === "success") {
          setGuestArray(res.data[0].guest_info);
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  return (
    <div className="isolate bg-white px-6 py-2 sm:py-2 lg:px-8">
      <div className="mx-auto mt-2 max-w-xl sm:mt-2">
        {/* {!guestArray.length ?<h1 className="text-center text-5xl">No guests</h1>:""} */}
        <ul role="list" className="divide-y divide-gray-100">
          {guestArray.map((guest) => (
            <li key={guest._id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm/6 font-semibold text-gray-900">
                    {guest.email}{" "}
                    {guestStatus.id === guest._id ? (
                      <small className="bg-gray-100">
                        {guestStatus.status}
                      </small>
                    ) : (
                      ""
                    )}
                  </p>

                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Change status
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="-mr-1 h-4 w-4 text-gray-400"
                        />
                      </MenuButton>
                    </div>

                    <MenuItems
                      transition
                      className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <div className="py-1">
                        <form action="#" method="POST">
                          {["removed", "booked", "waiting"].map((status) => (
                            <MenuItem key={status}>
                              {({ close }) => (
                                <button
                                  type="submit"
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setGuestStatus({ id: guest._id, status });
                                    close();
                                  }}
                                >
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </button>
                              )}
                            </MenuItem>
                          ))}
                        </form>
                      </div>
                    </MenuItems>
                  </Menu>

                  {guestStatus.id === guest._id ? (
                    <button
                      className="px-1"
                      onClick={() => {
                        fetch(
                          `http://localhost:3000/api/v1/admin/update-guest/${encodeURI(
                            hotel_name
                          )}/${encodeURI(guest._id)}`,
                          {
                            method: "PATCH",
                            credentials: "include",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              status: guestStatus.status,
                            }),
                          }
                        )
                          .then((res) => res.json())
                          .then((res) => {
                            if (res.status === "failed") {
                              window.alert("failure changing status");
                              setGuestStatus({});
                              return;
                            }
                            setAfterStatus((prev) => ({
                              ...prev,
                              [guest._id]: guestStatus.status,
                            }));
                            setGuestStatus({});
                          })
                          .catch((err) => console.error(err));
                      }}
                    >
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        Save
                      </span>
                    </button>
                  ) : (
                    ""
                  )}

                  <Link
                    to={`/change-hotel-status?name=${encodeURI(
                      guest.fullName
                    )}`}
                    className="pointer-events-none px-1"
                  >
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {afterStatus[guest._id] || guest.status}
                    </span>
                  </Link>

                  <Link
                    to={`/view-guest-profile?name=${hotel_name}&id=${guest._id}`}
                    className="px-1"
                  >
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {"view"}
                    </span>
                  </Link>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-s">
                <p className="text-sm/6 text-gray-900">{guest.fullName}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

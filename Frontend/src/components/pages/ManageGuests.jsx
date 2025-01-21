import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function ManageGuests() {
  const [hotelArray, setHotelArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/admin/my-profile`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        // if (res?.status !== "failed") {
        // Set the user data if the profile fetch is successful
        // setUser(res);
        //   console.log("unauth detected")
        console.log("**********", res);
        if (
          res.message === "Unauthorized request" ||
          res?.data?.role !== "guest-admin"
        ) {
          navigate("/no-page-found");
        }
        // }
      })
      .catch((err) => console.log(err));
  }, [navigate]);
  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/hotel/show-all-hotels`)
      .then((res) => res.json())
      .then((res) => {
        // setHotelArray()
        console.log(res.data);
        if (res?.status !== "failed") {
          setHotelArray(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  return (
    <div className="isolate bg-white px-6 py-2 sm:py-2 lg:px-8">
      <div className="mx-auto mt-2 max-w-xl sm:mt-2">
        <ul role="list" className="divide-y divide-gray-100">
          {/*  */}
          {console.log(hotelArray)}
          {hotelArray.map((hotel) => (
            <li key={hotel._id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <img
                  alt="no image found"
                  src={hotel.logo}
                  className="size-12 flex-none rounded-full bg-gray-50"
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm/6 font-semibold text-gray-900">
                    {hotel.name}
                  </p>
                  {/* <p className="mt-1 truncate text-xs/5 text-gray-500"> */}
                  {/* {hotel.hotelStatus} */}
                  {/* <Link to={`/update-hotel?name=${encodeURI(hotel.name)}`}>
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        Update
                      </span>
                    </Link>{" "} */}
                  <Link
                    to={`/show-guests?name=${encodeURI(hotel.name)}`}
                    className={
                      hotel.guestCount === 0 ? "pointer-events-none" : ""
                    }
                  >
                    <span
                      className={
                        hotel.guestCount === 0
                          ? "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                          : "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 text-blue-600"
                      }
                    >
                      Manage Guests
                    </span>
                  </Link>
                  <Link to={`#`} className="pointer-events-none px-1">
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      Guests: {hotel.guestCount}
                    </span>
                  </Link>
                  {/* <Menu as="div" className="relative inline-block text-left">
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
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <div className="py-1">
                        <MenuItem>
                          <Link
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                          >
                            Account settings
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                          >
                            Support
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                          >
                            License
                          </Link>
                        </MenuItem>
                        <form action="#" method="POST">
                          <MenuItem>
                            <button
                              type="submit"
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                            >
                              Sign out
                            </button>
                          </MenuItem>
                        </form>
                      </div>
                    </MenuItems>
                  </Menu> */}
                  {/* </p> */}
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="size-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs/5 text-gray-500">{hotel.address}</p>
                </div>
                <p className="text-sm/6 text-gray-900">{hotel.hotelStatus}</p>
              </div>
            </li>
          ))}

          {/*  */}
        </ul>
      </div>
    </div>
  );
}

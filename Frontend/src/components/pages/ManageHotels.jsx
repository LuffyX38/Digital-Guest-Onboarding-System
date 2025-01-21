import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ManageHotels() {
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
              if (res.message === "Unauthorized request" || res?.data?.role !== "main-admin") {
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
                  <p className="mt-1 truncate text-xs/5 text-gray-500">
                    {/* {hotel.hotelStatus} */}
                    <Link to={`/update-hotel?name=${encodeURI(hotel.name)}`}>
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        Update
                      </span>
                    </Link>{" "}
                    <Link
                      to={`/change-hotel-status?name=${encodeURI(hotel.name)}`}
                    >
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        Change Status
                      </span>
                    </Link>
                  </p>
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

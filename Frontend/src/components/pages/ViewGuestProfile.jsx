import React, { useEffect, useState } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

function ViewGuestProfile() {
  const urlParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const [profile, setProfile] = useState([]);
  let hotel_name = urlParams.get("name");
  let guest_id = urlParams.get("id");
  //   console.log(guest_id);

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/v1/guest/get-guest/${encodeURI(
        hotel_name
      )}/${encodeURI(guest_id)}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Unauthorized request" || res.status === "failed") {
          navigate("/no-page-found");
          return;
        }
        setProfile(res.data[0]);
      })
      .catch((err) => console.log(err));
  }, [setProfile, navigate]);
    const from = new Date(profile?.stayDates?.from).toLocaleDateString();
    const to = new Date(profile?.stayDates?.to).toLocaleDateString();
    const bookOn = new Date(profile?.createdAt).toDateString();
    // console.log(dt.toLocaleDateString());
  return (
    <div className="isolate bg-white px-6 py-2 sm:py-2 lg:px-8">
      {console.log(profile)}
      <div className="mx-auto mt-2 max-w-xl sm:mt-2">
        
        <div>
          <div className="px-4 sm:px-0">
            <h3 className="text-base/7 font-semibold text-gray-900 block">
              {hotel_name}
              {/* <small className="block text-gray-700"></small> */}
            </h3>
            <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
              {/* Personal details and application. */}
              Booked on {bookOn}
            </p>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">
                  Full name
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {profile.fullName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">
                  Staying hotel
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {hotel_name}
                  <small className="block">
                    {from}
                    {" - "}
                    {to}
                  </small>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">
                  Email address
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {profile.email}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">Address</dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {profile.Address}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">
                  Phone no
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {profile.mobileNumber}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">status</dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {profile.status}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">
                  ID number
                </dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {profile.idProofNumber}
                </dd>
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="button"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={()=>window.print()}
                >
                  Print
                </button>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewGuestProfile;
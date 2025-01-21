import { useCallback, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import {
  Field,
  Label,
  Switch,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import DateRangePicker from "./DateRangePicker";
import Alert from "../popovers/Alert";

export default function BookHotel() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [idProofNumber, setIdProofNumber] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");

  const [hotelName, setHotelName] = useState("");
  const [object, setObject] = useState({});
  const [alert, setAlert] = useState(false);
  const [resStatus, setResStatus] = useState(null);
  const [resMsg, setResMsg] = useState("");

  useEffect(() => {
    const urlParams = 
      window.location.pathname.split("/")[
        window.location.pathname.split("/").length - 1
      ]
    
    setHotelName(urlParams);
  });

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  useEffect(() => {
    if (!hotelName || !object) return;
    console.log(object);
    let url = `http://localhost:3000/api/v1/guest/book-hotel/${encodeURI(
      hotelName
    )}`;
    // url = ;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.success);
        setResStatus(res.status);
        setResMsg(res.message);
        if (res?.status === "failed") setAlert(true);
        if (res?.success) {
          navigate("/booked");
        }

        console.log(res);
      })
      .catch((err) => console.error(err))
      
  }, [object]);

  const submitButton = (e) => {
    e.preventDefault();

    // Custom validation logic
    if (
      !firstName ||
      !lastName ||
      !purposeOfVisit ||
      !startDate ||
      !endDate ||
      !userEmail ||
      !phoneNumber ||
      !address
    ) {
      window.alert("All fields are required!");
      return;
    }

    let obj = {
      fullName: firstName + " " + lastName,
      mobileNumber: countryCode + "" + phoneNumber,
      Address: address,
      purposeOfVisit,
      stayDates: { from: startDate.toISOString(), to: endDate.toISOString() },
      email: userEmail,
      idProofNumber,
      // stayingAt,
    };
    setObject(obj);
  };

  const handleDateChange = ({ start, end }) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="isolate bg-white px-6 py-2 sm:py-2 lg:px-8">
      {/* {console.log(stayDates)} */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="mt-2 text-lg/8 text-gray-600">Book your hotel here</p>
      </div>
      <form
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-10"
        onSubmit={submitButton}
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              First name
            </label>
            <div className="mt-2.5">
              <input
                id="first-name"
                name="first-name"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Last name
            </label>
            <div className="mt-2.5">
              <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <DateRangePicker onDateChange={handleDateChange} />

          <div className="sm:col-span-2">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  Purpose of visit
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 size-5 text-gray-400"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <button
                      className="block w-full px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setPurposeOfVisit("Business");
                      }}
                    >
                      Business
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="block w-full px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setPurposeOfVisit("Personal");
                      }}
                    >
                      Personal
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="block w-full px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setPurposeOfVisit("Tourist");
                      }}
                    >
                      Tourist
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
            <small className="inline-flex px-1">{purposeOfVisit}</small>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/*  */}
          <div className="sm:col-span-2">
            <label
              htmlFor="idProofNumber"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              ID Proof Number
            </label>
            <div className="mt-2.5">
              <input
                id="idProof"
                name="idProof"
                type="text"
                // autoComplete="email"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                value={idProofNumber}
                onChange={(e) => setIdProofNumber(e.target.value)}
                required
              />
            </div>
          </div>
          {/* <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Phone number
            </label>
            <div className="mt-2.5">
              <input
                id="phone-number"
                name="phone-number"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="123-456-7890"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                required
              />
            </div>
          </div> */}

          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Phone number
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md bg-white outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    id="country-code"
                    name="country-code"
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                    aria-label="Country Code"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pl-3.5 pr-7 text-base text-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+61">+61 (AU)</option>
                    {/* Add other country codes as needed */}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
                <input
                  id="phone-number"
                  name="phone-number"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="123-456-7890"
                  className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                  required
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Address
            </label>
            <div className="mt-2.5">
              <textarea
                id="address"
                name="address"
                rows={4}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        {/*  */}
        {resStatus === "failed" && alert ? (
          <Alert alertMessage={resMsg} setAlert={setAlert} />
        ) : (
          ""
        )}

        {/*  */}
        <button
          type="submit"
          className="mt-8 inline-block w-full rounded-md bg-indigo-600 py-3 text-center text-base font-semibold text-white shadow-sm ring-1 ring-indigo-600 focus:outline focus:outline-2 focus:outline-indigo-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

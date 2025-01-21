import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddHotel() {
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  let hotel_name = urlParams.get("name");

  const [hotelInfo, setHotelInfo] = useState({});
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
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
        if (res.message === "Unauthorized request" || res?.data?.role !== "main-admin") {
          navigate("/no-page-found");
        }
        // }
      })
      .catch((err) => console.log(err));
  }, [navigate]);



  useEffect(() => {
  }, []); // Fetch when hotel_name or location changes

  const handleSave = async (e) => {
    e.preventDefault();
      console.log(name, image, address);
    if (!name.trim() || !image || !address.trim()) {
      return console.log("All fields are required");
    }

    const formData = new FormData();
    formData.append("name", name);
   
      formData.append("logo", image);
      setLoading(true);
      
      formData.append("address", address);

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/hotel/add-hotel`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      const result = await res.json();
      if (result.status !== "failed") {
        window.alert("Hotel CREATED successfully");
        // Force a re-fetch of the updated data
        //   console.log(result.data);
        // Ensure we navigate with the updated name to trigger re-fetch
        // if (name)
          navigate(`/hotel?name=${encodeURI(name)}`, { replace: true });
          // setName("");
          
      } else {
        throw new Error("Failed to add hotel");
      }
    } catch (err) {
      window.alert("Error updating hotel info");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="isolate bg-white px-6 py-2 sm:py-2 lg:px-8">
      <div className="mx-auto mt-2 max-w-xl sm:mt-2">
        <form onSubmit={handleSave}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  {loading ? (
                    <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                      Uploading image...
                    </div>
                  ) : (
                    ""
                  )}
                  <label
                    htmlFor="file-upload"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Select image logo/ picture
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      {/* <img
                        src={hotelInfo?.hotel?.logo}
                        alt=""
                        className="mx-auto size-14 text-gray-300 rounded-full"
                      /> */}
                      <svg
                        className="mx-auto size-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                                                      className="sr-only"
                                                      required
                            onChange={(e) => setImage(e.target.files[0])}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs/5 text-gray-600">
                        PNG, JPG, JPEG, WEBP are allowed
                      </p>
                    </div>
                  </div>
                  <small>{image ? `${image.name} is selected` : ""}</small>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="changeName"
                      name="changeName"
                                          type="text"
                                          required
                      placeholder="Enter name here"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                <div className="col-span-full">
                  <label
                    htmlFor="Address"
                    className="block text-sm/6 font-medium text-gray-900 mt-2
                    "
                  >
                    Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Enter your adress here"
                                              value={address}
                                              required
                      onChange={(e) => setAddress(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          <div className="mt-6 flex items-center justify-normal gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add hotel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UpdateHotel() {
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);
  let hotel_name = urlParams.get("name");

  const [hotelInfo, setHotelInfo] = useState({});
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
          if (
            res.message === "Unauthorized request" ||
            res?.data?.role !== "main-admin"
          ) {
            navigate("/no-page-found");
          }
          // }
        })
        .catch((err) => console.log(err));
    }, [navigate]);

  // Fetch hotel data when the hotel_name or location changes
  const fetchData = useCallback(async () => {
    console.log("Fetching data for hotel:", hotel_name);
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/hotel/show-this-hotel/${hotel_name}`
      );
      const data = await res.json();
      console.log("Hotel data received:", data); // Log for debugging

      if (data.message === "No hotel found") {
        window.alert(data.message);
        return; // Exit early if no hotel is found
      }
      setHotelInfo(data?.data); // Update hotelInfo state with fetched data
    } catch (err) {
      console.log("Error fetching hotel info:", err);
    }
  }, [hotel_name]);

  useEffect(() => {
    if (hotel_name) {
      fetchData(); 
    }
  }, [hotel_name, location.search, fetchData]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim() && !image) {
      window.alert("Please provide name or image to update");
    }

    const formData = new FormData();
    if (name) formData.append("name", name);
    if (image) {
      formData.append("logo", image);
      setLoading(true);
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/hotel/update-hotel-info/${hotel_name}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );
      const result = await res.json();
      if (result.status !== "failed") {
        window.alert("Hotel updated successfully");

        // Update hotelInfo state to reflect the new image and name
        setHotelInfo((prevHotelInfo) => ({
          ...prevHotelInfo,
          hotel: {
            ...prevHotelInfo.hotel,
            name: name || prevHotelInfo.hotel.name, // Update name if provided
            logo: image ? URL.createObjectURL(image) : prevHotelInfo.hotel.logo, // Update logo if image is provided
          },
        }));

        // If the name is updated, navigate with the new hotel name
        if (name) {
          navigate(`/update-hotel?name=${encodeURIComponent(name)}`, {
            replace: true,
          });
        }

        setName(""); // Reset name state
        setImage(null); // Reset image state
      } else {
        throw new Error("Failed to update hotel");
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
                    Change photo
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <img
                        src={hotelInfo?.hotel?.logo || "/default-logo.png"} // Display the new logo after update
                        alt="Hotel logo"
                        className="mx-auto size-14 text-gray-300 rounded-full"
                      />
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
                    htmlFor="changeName"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Change name
                  </label>
                  <div className="mt-2">
                    <input
                      id="changeName"
                      name="changeName"
                      type="text"
                      placeholder={hotelInfo?.hotel?.name || "Enter new name"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
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
              Update hotel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

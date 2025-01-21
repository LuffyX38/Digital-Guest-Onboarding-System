import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";

export default function Card() {
  // const { hotel, setCount } = useOutletContext();
  const [hotel, setHotel] = useState([]);
  const [count, setCount] = useState(1);
  const [btn, setBtn] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/v1/hotel/show-all-hotels?count=${count}&limit=4`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setHotel((prev) => [...prev, ...res.data]);
        if (res?.data?.length === 0) setBtn(false);
      })
      .catch((err) => console.error(err));
  }, [count]);

  return (
    // <div>hey</div>
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {/* Customers also purchased */}
        </h2>
        {/* {console.log("length ", hotel.length)} */}
        {/* Responsive Grid for 4 Cards */}
        <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {hotel?.map((hotel) => (
            <div key={hotel._id} className="group relative">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200">
                <img
                  alt="No image found"
                  src={hotel.logo}
                  className="h-full w-full object-cover group-hover:opacity-75"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link to={"/hotel?name=" + hotel.name}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {hotel.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{hotel.address}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {hotel.hotelStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          {btn ? (<button
            onClick={() => setCount((prev) => prev + 1)}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            Load more
          </button>) : ""}
        </div>
      </div>
    </div>
  );
}

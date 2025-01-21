import { useEffect, useCallback, useState } from "react";
import Header from "./components/pages/Header";
import { Outlet, useNavigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./components/context/Context";
import { AuthProvider, useAuth } from "./components/context/Context";

function App() {
  const [hotel, setHotel] = useState([]);
  const [count, setCount] = useState(1);
  const navigate = useNavigate();

  const fetchHotels = useCallback(async (count) => {
    fetch(
      `http://localhost:3000/api/v1/hotel/show-all-hotels?count=${count}&limit=4`
    )
      .then((res) => res.json())
      .then((res) => setHotel((prev) => [...prev, ...res.data]))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (count === 1) setHotel([]);



    // fetchHotels(count);
  // }, [count, navigate]);
  }, [count, navigate,fetchHotels]);

  return (
    <>
      {/* <h1 className='text-xl'>hey this is Aditya</h1> */}
      {/* <Home/> */}
      <AuthProvider>
        <Header />
        <Outlet context={{ hotel, setCount }} />
      </AuthProvider>
    </>
  );
}

export default App;

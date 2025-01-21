import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromChildren,
} from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Card from "./components/pages/Card.jsx";
import BookHotel from "./components/pages/BookHotel.jsx";

import HotelInfo from "./components/pages/HotelInfo.jsx";
import ThankYou from "./components/pages/ThankYou.jsx";
import ErrorPage from "./components/pages/ErrorPage.jsx";
import SignIn from "./components/pages/SignIn.jsx";
import Register from "./components/pages/Register.jsx";
import ManageGuests from "./components/pages/ManageGuests.jsx";
import ManageHotels from "./components/pages/ManageHotels.jsx";
import UpdateHotel from "./components/pages/UpdateHotel.jsx";
import ChangeHotelStatus from "./components/pages/ChangeHotelStatus.jsx";
import AddHotel from "./components/pages/AddHotel.jsx";
import ShowGuests from "./components/pages/ShowGuests.jsx";
import ViewGuestProfile from "./components/pages/ViewGuestProfile.jsx";

const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Card />} />
      <Route
        path="hotel"
        element={<HotelInfo />}
        errorElement={<ErrorPage />}
      />
      <Route path="hotel-book/:hotel_name" element={<BookHotel />} />
      <Route path="booked" element={<ThankYou />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<Register />} />
      <Route path="manage-guests" element={<ManageGuests />} />
      <Route path="manage-hotels" element={<ManageHotels />} />
      <Route path="add-hotel" element={<AddHotel />} />
      <Route path="show-guests" element={<ShowGuests />} />
      <Route path="view-guest-profile" element={<ViewGuestProfile />} errorElement={<ErrorPage/>} />
      <Route
        path="update-hotel"
        element={<UpdateHotel />}
        errorElement={<ErrorPage />}
      />
      <Route
        path="change-hotel-status"
        element={<ChangeHotelStatus />}
        errorElement={<ErrorPage />}
      />
      <Route path="*" element={<ErrorPage />} />
      <Route path="no-page-found" element={<ErrorPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <RouterProvider router={router} />
  //</StrictMode>
);

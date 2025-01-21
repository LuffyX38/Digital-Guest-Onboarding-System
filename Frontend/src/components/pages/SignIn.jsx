import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Register from "./Register";
import Alert from "../popovers/Alert";
import { useAuth } from "../context/Context";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [object, setObject] = useState("");
  const [alert, setAlert] = useState(false);
  const [resMsg, setResMsg] = useState("");
  const [resStatus, setResStatus] = useState(false);
  const navigate = useNavigate();
   const { user, setUser } = useAuth();

  // This useEffect fetches the user profile once the user is logged in



   useEffect(() => {
     if (resStatus !== "failed") {
       fetch(`http://localhost:3000/api/v1/admin/my-profile`, {
         method: "GET",
         credentials: "include",
       })
         .then((res) => res.json())
         .then((res) => {
           // if (res?.status !== "failed") {
           // Set the user data if the profile fetch is successful
           setUser(res);
           console.log(res);
           // }
         })
         .catch((err) => console.log(err));
     }
   }, [resStatus]);

 

  useEffect(() => {
    if (!object) return;
    let url = `http://localhost:3000/api/v1/admin/login`;

    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setResMsg(res?.message);
        if (res?.status === "failed") {
          setResStatus(res.status);
          setAlert(true);
        } else if (res?.success) {

           
           


          
          setResStatus("success");
          navigate("/"); 
        }
      })
      .catch((err) => console.log(err));
  }, [object]);

  const handleSumbit = (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    let obj = {
      email: email.trim(),
      password: password,
    };

    setObject(obj);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Admin sign in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {resStatus === "failed" && alert ? (
            <Alert alertMessage={resMsg} setAlert={setAlert} />
          ) : (
            ""
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSumbit}
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          <Link
            to={"/sign-up"}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Don't have an account?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;

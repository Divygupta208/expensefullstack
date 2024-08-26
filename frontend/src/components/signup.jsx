import React, { useRef, useState } from "react";

const Signup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setErrors({ name: "", email: "", password: "" });

    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    let isValid = true;
    const newErrors = {};

    if (name === "") {
      newErrors.name = "Name is required";
      isValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (password === "") {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log("Form submitted", { name, email, password });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 grid grid-cols-2 gap-4 p-4">
        <div className="h-96 md:h-56 w-96">
          <img src="/cash-svgrepo-com.svg" alt="Image 1" className=" " />
        </div>
        <div className="h-64 md:h-56 w-64 -mx-10">
          <img src="/credit-card-svgrepo-com.svg" alt="Image 2" className="" />
        </div>
        <div className="h-40 md:h-56 w-40 mx-72">
          <img
            src="/my-category-svgrepo-com.svg"
            alt="Image 3"
            className="h-full w-full "
          />
        </div>
        <div className="h-72 md:h-60 w-72 mx-[30vw] mt-[25vh] absolute">
          <img src="/stock-svgrepo-com.svg" alt="Image 4" className="" />
        </div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center">
        <div className="w-full md:w-3/4 flex items-center justify-center">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-4 md:p-8 rounded-lg shadow-[10px_5px_60px_10px_rgba(0,0,0,0.3)] w-full"
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Name
              </label>
              <input
                ref={nameRef}
                type="text"
                id="name"
                className={`border-2 p-2 w-full rounded-md focus:outline-none ${
                  errors.name ? "border-red-500" : "border-gray-400"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                ref={emailRef}
                type="text"
                id="email"
                className={`border-2 p-2 w-full rounded-md focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-400"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                id="password"
                className={`border-2 p-2 w-full rounded-md focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-400"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#000000] text-white font-bold py-2 px-4 rounded hover:bg-blue-700 w-36 mx-40"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

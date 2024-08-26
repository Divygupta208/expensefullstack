import React from "react";

const Signup = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 grid grid-cols-2 gap-4 p-4">
        <div className="h-96 md:h-56 w-96">
          <img src="public/cash-svgrepo-com.svg" alt="Image 1" className=" " />
        </div>
        <div className="h-64 md:h-56 w-64 -mx-10">
          <img
            src="public/credit-card-svgrepo-com.svg"
            alt="Image 2"
            className=""
          />
        </div>
        <div className="h-40 md:h-56 w-40 mx-72">
          <img
            src="public/my-category-svgrepo-com.svg"
            alt="Image 3"
            className="h-full w-full "
          />
        </div>
        <div className="h-72 md:h-60 w-72 mx-[30vw] mt-[25vh] absolute">
          <img src="public/stock-svgrepo-com.svg" alt="Image 4" className="" />
        </div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center">
        <div className="w-full md:w-3/4 flex items-center justify-center">
          <form className="bg-white p-4 md:p-8 rounded-lg shadow-[10px_5px_60px_10px_rgba(0,0,0,0.3)] w-full">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="border-2 border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                className="border-2 border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="border-2 border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="bg-[#000000] text-white font-bold py-2 px-4 rounded hover:bg-blue-700 w-36 mx-40">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoDiamond } from "react-icons/io5";
import { useSelector } from "react-redux";

const ProfileView = ({ isPremiumUser, handleUserLogOut }) => {
  const userData = useSelector((state) => state.auth.userData);

  const handleRazorPayButtonClick = async (e) => {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/purchase/premiummembership", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    console.log(data);

    const options = {
      key: data.key_id,
      order_id: data.order.id,
      handler: async function (response) {
        const updateResponse = await fetch(
          "/api/purchase/updatetransactionstatus",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            }),
          }
        );

        const result = await updateResponse.json();

        if (result.success) {
          toast("YaY are now a premium user!");
          localStorage.setItem("token", result.token);
          const decodedToken = jwtDecode(result.token);
          const isPremium = decodedToken.isPremium;
          dispatch(authAction.setIsPremium(isPremium));
        } else {
          toast.error("Please Try Again 🫤");
        }
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", async function (response) {
      console.log("Payment Failed: ", response);

      await fetch("/api/purchase/updatetransactionstatus", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: options.order_id,
        }),
      });

      toast("Payment failed. Please try again.");
    });
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={userData.image}
        alt="User Profile"
        className="w-20 h-20 rounded-full mb-4"
      />
      <h3 className="text-lg font-semibold">{userData.name}</h3>
      <p className="text-sm text-gray-600">{userData.email}</p>
      <p className="text-sm text-gray-600">{userData.contact}</p>
      {!isPremiumUser ? (
        <button
          onClick={handleRazorPayButtonClick}
          className="mt-4 px-6 py-2 gap-1 bg-[#ff662a] text-white font-semibold rounded-md flex"
        >
          Buy <IoDiamond className="mt-1.5" />
        </button>
      ) : (
        <p>
          <IoDiamond />
        </p>
      )}

      <button
        onClick={handleUserLogOut}
        className="mt-4 px-4 py-2 gap-1 bg-black text-white font-semibold rounded-md flex"
      >
        Log Out
      </button>
    </div>
  );
};

export default ProfileView;

import { useEffect, useRef, useState } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { useLocation } from "react-router-dom";
import Signup from "../components/Signup";
import "locomotive-scroll/dist/locomotive-scroll.css"; // Locomotive Scroll CSS
import Footer from "../components/footer";
import { motion } from "framer-motion";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

const SignupPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "signup";
  const scrollRef = useRef(null);
  const [bgColor, setBgColor] = useState("rgb(255, 255, 255)"); // Default light blue

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1.5,
    });

    // Define colors
    const startColor = [255, 255, 255];
    const midColor = [255, 205, 212];
    const endColor = [199, 255, 218];

    scroll.on("scroll", (args) => {
      const { scroll } = args;

      const progress = Math.min(scroll.y / 2000, 1);

      let newColor;
      if (progress <= 0.5) {
        const localProgress = progress * 2;
        newColor = `rgb(
          ${Math.floor(
            startColor[0] + (midColor[0] - startColor[0]) * localProgress
          )},
          ${Math.floor(
            startColor[1] + (midColor[1] - startColor[1]) * localProgress
          )},
          ${Math.floor(
            startColor[2] + (midColor[2] - startColor[2]) * localProgress
          )}
        )`;
      } else {
        const localProgress = (progress - 0.5) * 2;
        newColor = `rgb(
          ${Math.floor(
            midColor[0] + (endColor[0] - midColor[0]) * localProgress
          )},
          ${Math.floor(
            midColor[1] + (endColor[1] - midColor[1]) * localProgress
          )},
          ${Math.floor(
            midColor[2] + (endColor[2] - midColor[2]) * localProgress
          )}
        )`;
      }

      setBgColor(newColor);
    });

    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      style={{ backgroundColor: bgColor }}
    >
      <Signup mode={mode} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
        transition={{
          duration: 1.5, // Adjust duration as needed
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="ml-[48vw] text-3xl"
      >
        <MdKeyboardDoubleArrowDown />
      </motion.div>

      {/* Image Sections with Animation */}
      <motion.div
        className="w-[100vw] h-[100vh] flex justify-center items-center mt-20"
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="md:w-3/4 flex flex-col gap-8 p-6 ">
          <div className="flex flex-col items-center">
            <div className="h-96 w-96">
              <img
                src="/graphs-economy-svgrepo-com.svg"
                alt="Economy Graph"
                className="h-full w-full object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-4 bg-blue-500 text-white p-3 rounded-lg shadow-md text-center text-sm">
              📊 This image represents economic graphs and data analysis.
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="w-[100vw] h-[100vh] flex justify-center items-center mt-40"
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="md:w-3/4 flex flex-col gap-8 p-6 ">
          <div className="flex flex-col items-center">
            <div className="h-96 w-96">
              <img
                src="/notebook-svgrepo-com.svg"
                alt="Notebook"
                className="h-full w-full object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-4 bg-yellow-400 text-black p-3 rounded-lg shadow-md text-center text-sm">
              📒 A notebook symbolizing organization and productivity.
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="w-[100vw] h-[100vh] flex justify-center items-center mt-40"
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="md:w-3/4 flex flex-col gap-8 p-6 ">
          <div className="flex flex-col items-center">
            <div className="h-96 w-96">
              <img
                src="/savings-svgrepo-com.svg"
                alt="Savings"
                className="h-full w-full object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-4 bg-green-500 text-white p-3 rounded-lg shadow-md text-center text-sm">
              💰 A savings jar representing financial security.
            </div>
          </div>
        </div>
      </motion.div>

      <div className="bg-slate-900 h-[15vh]">
        <Footer />
      </div>
    </div>
  );
};

export default SignupPage;

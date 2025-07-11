'use client';

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.section
      ref={ref}
      id="about"
      className="relative z-10 flex items-center justify-center w-full"
    >
    
      {/* Floating Emojis */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-20 "
        animate={{ y: [0, 10, -10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute top-10 left-10 text-6xl">🍅</div>
        <div className="absolute top-32 right-20 text-6xl">🥑</div>
        <div className="absolute bottom-10 left-24 text-7xl">🍋</div>
        <div className="absolute bottom-20 right-28 text-7xl">🍓</div>
      </motion.div>

      <motion.div
        // style={{ y, opacity }}
        className="flex flex-col-reverse md:flex-row items-stretch justify-between gap-10 w-full max-w-6xl"
      >
        
        {/* Left - Image */}
        <div className="w-full md:w-1/2 m-2 p-4 flex justify-center">
          <div className="relative w-full max-w-[450px] aspect-[5/6] rounded-3xl shadow-xl overflow-hidden">
            <Image
              src="/images/about.jpg"
              alt="Cooking Together"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right - Story */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left px-4 m-2">
          <h2 className="text-5xl  font-extrabold text-green-700">
            From Our Kitchen to Yours
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            TastyCrave was born out of our shared love for food and the occasional frustration we felt whenever we wanted to try something new. As passionate food lovers, my partner and I often found ourselves hopping between various recipe websites, searching for that <em>perfect</em> dish that suited our preferences – whether vegan, spicy, sweet or something in between.
          </p>
          <p className="text-gray-600 text-base md:text-lg">
            With both of us coming from technology backgrounds, we began to wonder: what if there were a single, personalised space to find and share all kinds of recipes tailored to individual tastes? A digital recipe book designed to be as flexible as your cravings.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
          >
            Explore Recipes →
          </motion.button>
        </div>
      </motion.div>

    </motion.section>
  );
}

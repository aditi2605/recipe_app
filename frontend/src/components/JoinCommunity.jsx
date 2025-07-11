'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function JoinCommunity() {
  const testimonials = [
    { emoji: "👩🏽‍🍳", text: "Love the global recipes!", location: "USA", x: "left-[10%]", y: "top-[30%]" },
    { emoji: "🧑🏻‍🍳", text: "TastyCrave changed my cooking!", location: "Japan", x: "right-[3%]", y: "top-[35%]" },
    { emoji: "👨🏾‍🍳", text: "Best place to discover food!", location: "Brazil", x: "left-[28%]", y: "bottom-[20%]" },
    { emoji: "👩🏻‍🍳", text: "Such a lovely community 💕", location: "India", x: "right-[18%]", y: "bottom-[32%]" },
  ]

  return (
    <section id="joinCommunity" className="relative flex flex-col items-center justify-center w-full overflow-hidden">
      <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mt-10 mb-12">
        Join a Delicious Global Community 🌍
      </h2>

      {/* World Map Background */}
      <motion.div
        className="relative w-full ..."
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 2 }}
      >
        
      <div className="relative w-full max-w-7xl h-[420px] bg-[url('/images/worldmap.jpg')] bg-center bg-no-repeat bg-cover overflow-hidden shadow-2xl shadow-black rounded-xl px-4 sm:px-6 md:px-10 mx-auto">
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-white/60 backdrop-blur-sm z-0" />


        {testimonials.map((item, idx) => (
          <motion.div
            key={idx}
            className={`absolute ${item.x} ${item.y} flex items-center gap-2`}
            animate={{ y: [0, -6, 0], opacity: [0, 1] }}
            transition={{ duration: 8 + idx * 0.8, repeat: Infinity }}
          >
            <motion.span
              className="text-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity, delay: idx * 0.5 }}
            >
              {item.emoji}
            </motion.span>

            <span className="text-md sm:text-lg text-pink-600 font-semibold">{item.location}</span>
            <div className="bg-white/80 backdrop-blur-md border border-green-100 rounded-xl shadow-md px-4 py-2 text-sm text-gray-800 max-w-[160px]">
              “{item.text}”
            </div>
          </motion.div>
        ))}
      </div>
       </motion.div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {[
          { value: "+1M", label: "Recipes Shared" },
          { value: "85+", label: "Countries Represented" },
          { value: "4.8★", label: "Avg Community Rating" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg shadow-black border border-green-100 rounded-xl p-6 m-2 hover:shadow-lg transition duration-300"
          >
            <h3 className="text-3xl font-bold text-green-700">{stat.value}</h3>
            <p className="text-sm mt-2 text-gray-600">{stat.label}</p>

          </div>
        ))}
        {/* CTA btn */}
          <Link href='#' className='items-center justify-center bg-green-600 text-white px-6 py-3 rounded-full shadow-md font-bold hover:bg-pink-500 transition'>Join Now!</Link>
        
      </div>
    </section>
  )
}

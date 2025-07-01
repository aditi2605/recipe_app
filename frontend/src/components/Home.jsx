'use client'

import Nav from '../components/Nav.jsx'
import About from '../components/About.jsx'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home({ handleLogin }) {
  const cards = [
    {
      img: "/images/pancake.jpg",
      title: "Breakfast",
      likes: "10k",
      description: "Kickstart your day with fluffy, nutritious pancakes.",
      tag: "New",
      author: "Chef Mia",
      prepTime: "15 mins",
      icon: "🥞",
      avatar: "👩🏼",
    },
    {
      img: "/images/salad_bowl.jpg",
      title: "Lunch",
      likes: "5k",
      description: "Fresh, colorful salads for a wholesome afternoon.",
      tag: "Vegan",
      author: "Chef Alex",
      prepTime: "20 mins",
      icon: "🥗",
      avatar: "👨🏼‍🦰",
    },
    {
      img: "/images/dinner.jpg",
      title: "Dinner",
      likes: "3k",
      description: "End your day with something hearty and comforting.",
      tag: "Popular",
      author: "Chef Dora",
      prepTime: "30 mins",
      icon: "🍛",
      avatar: "🧑🏻‍🍳",
    },
    {
      img: "/images/dessert.jpg",
      title: "Dessert",
      likes: "20k",
      description: "A sweet end to your day with comforting desserts.",
      tag: "Sweet",
      author: "Chef Leo",
      prepTime: "10 mins",
      icon: "🍰",
      avatar: "👨🏻‍🍳",
    },
  ];

  const [modalTrigger, setModalTrigger] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let typingTimeout;
    let currentIndex = 0;
    const card = cards[activeIndex];
    setTypedText("");

    const typingInterval = setInterval(() => {
      currentIndex++;
      setTypedText(card.title.slice(0, currentIndex));
      if (currentIndex >= card.title.length) {
        clearInterval(typingInterval);
        typingTimeout = setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % cards.length);
        }, 2000);
      }
    }, 150);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(typingTimeout);
    };
  }, [activeIndex]);

  const directions = [
    { x: 0, y: -140 },
    { x: 140, y: 0 },
    { x: 0, y: 140 },
    { x: -140, y: 0 },
  ];

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['100%', '0%']);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])


  return (
    <>
      <Nav trigger={modalTrigger} />

      <div ref={containerRef} className="relative h-[200vh] overflow-hidden">

        {/* Hero Section (Fixed) */}
        <motion.section
          className="relative top-0 left-0 w-full h-screen z-0 bg-gradient-to-br from-lime-50 to-pink-50"
        >
          <div className="h-full px-4 sm:px-6 md:px-10 py-24 flex flex-col lg:flex-row items-center justify-between gap-12 w-full max-w-7xl mx-auto">

            {/* Animated Emojis Background */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-10 text-green-300"
              animate={{ x: [0, 10, -10, 0], y: [0, -10, 10, 0] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute top-20 left-10 text-6xl">🍕</div>
              <div className="absolute top-30 left-360 text-8xl -translate-x-1/2 -translate-y-1/2">🍩</div>
              <div className="absolute bottom-10 left-140 text-6xl -translate-x-1/2 -translate-y-1/2">🌯</div>
              <div className="absolute top-90 right-40 text-7xl rotate-12">🍔</div>
              <div className="absolute bottom-10 right-10 text-7xl rotate-12">🥗</div>
              <div className="absolute top-1/3 left-1/2 text-6xl -translate-x-1/2 -translate-y-1/2">🍟</div>
              <div className="absolute bottom-8 left-20 text-8xl -translate-x-1/2 -translate-y-1/2">🍪</div>
            </motion.div>

            {/* Left Content */}
            <div className="w-full lg:w-1/2 z-10 text-center lg:text-left space-y-6 px-2 md:px-4">

              <h1 className="text-5xl sm:text-6xl font-extrabold text-green-800 leading-tight">
                Discover Recipes
                <br />
                <span className="text-gray-700 font-medium">Crafted for Every Craving</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Your digital recipe book to explore, save & share delicious dishes from around the world.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setModalTrigger('login')}
                  className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition font-semibold"
                >
                  Browse Recipes
                </button>
                <button
                  onClick={() => setModalTrigger('signup')}
                  className="px-6 py-3 border border-green-600 text-green-700 rounded-full hover:bg-green-100 transition font-semibold"
                >
                  Submit Yours
                </button>
              </div>
            </div>

            {/* Right Content (Cards) */}
            <div className="relative w-full max-w-[320px] sm:max-w-[200px] h-[280px] flex justify-center items-center mx-auto pt-20 z-10 border">

              {cards.map((dish, index) => {
                const isActive = index === activeIndex;
                const dirIndex = (index - activeIndex + cards.length) % cards.length;
                const { x, y } = directions[dirIndex % 4];
                const scale = isActive ? 1.15 : 0.9;
                const zIndex = isActive ? 20 : 0;

                return (
                  <motion.div
                    key={index}
                    className="absolute w-[220px] py-12"
                    animate={{ x, y, scale, zIndex, opacity: isActive ? 1 : 0.6 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    whileHover={{ scale: 1.05, rotate: 1 }}
                  >
                    <div
                      className={`bg-white rounded-3xl p-4 space-y-3 transition duration-300 ${
                        isActive
                          ? "ring-4 ring-offset-2 ring-transparent bg-clip-padding shadow-xl shadow-[0_0_30px_5px_rgba(34,197,94,0.4)]"
                          : "opacity-80"
                      }`}
                      style={{
                        backgroundImage: isActive
                          ? "linear-gradient(135deg, #bbf7d0,rgb(250, 227, 249))"
                          : "white",
                        boxShadow: isActive
                          ? "0 0 30px 10px rgba(16, 185, 129, 0.4)"
                          : "none",
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xl">{dish.icon}</span>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          {dish.tag}
                        </span>
                      </div>
                      <Image
                        src={dish.img}
                        alt={dish.title}
                        width={300}
                        height={200}
                        className="rounded-xl object-cover w-full h-30"
                      />
                      <h3 className="text-green-800 font-bold text-lg">
                        {isActive ? typedText : dish.title}
                      </h3>
                      <p className="text-sm text-gray-500">{dish.description}</p>
                      <div className="text-xs text-gray-400">⏱️ {dish.prepTime}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm flex items-center gap-2">
                          <span className="text-pink-500 text-base">❤️</span> {dish.likes} likes
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{dish.avatar}</span>
                          <span className="text-xs text-gray-600">{dish.author}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* About Section */}
       <motion.section
  style={{ y, opacity }}
  className="absolute top-0 left-0 w-full h-screen z-10 bg-[#fffefc] bg-opacity-95 backdrop-blur-md flex items-center justify-center"
>
  <About />
</motion.section>
      </div>
    </>
  );
}

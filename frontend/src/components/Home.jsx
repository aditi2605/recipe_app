'use client'

import Nav from '../components/Nav.jsx'
import About from '../components/About.jsx'
import ConnectPeople from './ConnectPeople.jsx'
import { useState, useEffect } from 'react'
import Image from 'next/image'
// import AOS from 'aos'
// import 'aos/dist/aos.css'
import Footer from './Footer.jsx'
import JoinCommunity from './JoinCommunity.jsx'
import Gallery from './Gallery.jsx'

export default function Home() {
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
  ]

  const [modalTrigger, setModalTrigger] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [typedText, setTypedText] = useState("")

  // useEffect(() => {
  //   AOS.init({ duration: 800, once: true })
  // }, [])

  useEffect(() => {
    // AOS.init({ duration: 800, once: true })

    let typingTimeout
    let currentIndex = 0
    const card = cards[activeIndex]
    setTypedText("")

    const typingInterval = setInterval(() => {
      currentIndex++
      setTypedText(card.title.slice(0, currentIndex))
      if (currentIndex >= card.title.length) {
        clearInterval(typingInterval)
        typingTimeout = setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % cards.length)
        }, 2000)
      }
    }, 150)

    return () => {
      clearInterval(typingInterval)
      clearTimeout(typingTimeout)
    }
  }, [activeIndex])

  const directions = [
    { x: 0, y: -140 },
    { x: 140, y: 0 },
    { x: 0, y: 140 },
    { x: -140, y: 0 },
  ]

  return (
    <>
      <Nav trigger= {modalTrigger} />

      <div className="w-full overflow-x-hidden space-y-0 bg-[#CBF3F0]">

        {/* Hero Section */}
        <section className="w-full bg-[#F7FFF7] pt-30 ">
          <div className="max-w-7xl px-4 sm:px-6 md:px-10 mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-24">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6" >
              <h1 className="text-6xl sm:text-5xl md:text-6xl font-extrabold text-[#FF6B6B] leading-tight">
                Discover Recipes
                <br />
                <span className="text-[#FF9F1C] font-medium text-5xl">Crafted for Every Craving</span>
              </h1>
              <p className="text-[#1F1F1F] text-base sm:text-lg">
                Your digital recipe book to explore, save & share delicious dishes from around the world.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
                <button
                  onClick={() => setModalTrigger('login')}
                  className="px-6 py-3 bg-[#FF6B6B] text-white text-xl rounded-full hover:bg-[#FF9F1C] transition font-semibold"
                >
                  Browse Recipes
                </button>
                <button
                  onClick={() => setModalTrigger('signup')}
                  className="px-6 py-3 border border-[#FF6B6B] text-[#FF6B6B] text-xl rounded-full hover:bg-[#FFE66D] transition font-semibold"
                >
                  Submit Yours
                </button>
              </div>
            </div>

            {/* Cards Section */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="relative hidden md:flex w-full max-w-[330px] sm:max-w-[240px] md:max-w-[220px] h-[400px] sm:h-[320px] md:h-[560px] justify-center items-start pt-6 sm:pt-10 md:pt-42 md:mb-2 sm:mb-2 z-10" data-aos="fade-right">
                {cards.map((dish, index) => {
                  const isActive = index === activeIndex
                  const dirIndex = (index - activeIndex + cards.length) % cards.length
                  const { x, y } = directions[dirIndex % 4]
                  const scale = isActive ? 1.15 : 0.9
                  const zIndex = isActive ? 20 : 0

                  return (
                    <div
                      key={index}
                      className="absolute transition-all duration-300 ease-in-out"
                      style={{
                        transform: `translate(${x}px, ${y}px) scale(${scale})`,
                        zIndex,
                        opacity: isActive ? 1 : 0.6,
                        width: '100%',
                      }}
                    >
                      <div
                        className={`bg-white rounded-3xl p-4 space-y-3 ${
                          isActive
                            ? "ring-4 ring-offset-2 ring-transparent bg-clip-padding shadow-xl shadow-[0_0_30px_5px_rgba(255,107,107,0.4)]"
                            : "opacity-80"
                        }`}
                        style={{
                          backgroundImage: isActive
                            ? "linear-gradient(135deg, #FFE66D, #CBF3F0)"
                            : "white",
                          boxShadow: isActive
                            ? "0 0 30px 10px rgba(255, 107, 107, 0.4)"
                            : "none",
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xl">{dish.icon}</span>
                          <span className="bg-[#FFE66D] text-[#FF6B6B] text-xs px-2 py-1 rounded-full">
                            {dish.tag}
                          </span>
                        </div>
                        <Image
                          src={dish.img}
                          alt={dish.title}
                          width={300}
                          height={180}
                          className="rounded-xl object-cover w-full h-28 sm:h-24 md:h-20"
                        />
                        <h3 className="text-[#FF6B6B] font-bold text-lg">
                          {isActive ? typedText : dish.title}
                        </h3>
                        <p className="text-sm text-[#1F1F1F]">{dish.description}</p>
                        <div className="text-xs text-[#1F1F1F]">⏱️ {dish.prepTime}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#FF9F1C] text-sm flex items-center gap-2">
                            <span className="text-base">❤️</span> {dish.likes} likes
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{dish.avatar}</span>
                            <span className="text-xs text-[#1F1F1F]">{dish.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Mobile Horizontal Scroll */}
              <div className="md:hidden flex gap-4 overflow-x-auto px-1 pt-10 w-full">
                {cards.map((dish, index) => (
                  <div
                    key={index}
                    className="min-w-[260px] max-w-[280px] bg-white rounded-3xl p-4 space-y-3 shadow-md flex-shrink-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xl">{dish.icon}</span>
                      <span className="bg-[#FFE66D] text-[#FF6B6B] text-xs px-2 py-1 rounded-full">
                        {dish.tag}
                      </span>
                    </div>
                    <Image
                      src={dish.img}
                      alt={dish.title}
                      width={300}
                      height={180}
                      className="rounded-xl object-cover w-full h-28"
                    />
                    <h3 className="text-[#FF6B6B] font-bold text-lg">{dish.title}</h3>
                    <p className="text-sm text-[#1F1F1F]">{dish.description}</p>
                    <div className="text-xs text-[#1F1F1F]">⏱️ {dish.prepTime}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#FF9F1C] text-sm flex items-center gap-2">
                        <span className="text-base">❤️</span> {dish.likes} likes
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dish.avatar}</span>
                        <span className="text-xs text-[#1F1F1F]">{dish.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Wavy Divider */}
          <div className="w-full overflow-hidden leading-[0]">
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-current text-[#FFE66D]">
              <path d="M0,64 
                      C60,80 80,160 100,192 
                      C120,224 140,224 160,192 
                      C180,160 200,64 240,64 
                      C280,64 300,128 320,192 
                      C340,256 380,256 400,192 
                      C420,128 460,128 480,192 
                      C500,256 540,256 560,192 
                      C580,128 620,128 640,192 
                      C660,256 700,256 720,192 
                      C740,128 780,128 800,192 
                      C820,256 860,256 880,192 
                      C900,128 940,128 960,192 
                      C980,256 1020,256 1040,192 
                      C1060,128 1100,128 1120,192 
                      C1140,256 1180,256 1200,192 
                      C1220,28 1260,128 1280,192
                      C1300,256 1340,256 1360,192 
                      C1380,128 1400,64 1440,64 
                      L1440,320 L0,320 Z" />
            </svg>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-[#FFE66D]" >
          <About />
          <div className="w-full overflow-hidden leading-[0]">
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-current text-[#fefae0]">
              <path d="M0,64
                C60,80 80,160 100,192 
                C120,224 140,224 160,192 
                C180,160 200,64 240,64 
                C280,64 300,128 320,192 
                C340,256 380,256 400,192 
                C420,128 460,128 480,192 
                C500,256 540,256 560,192 
                C580,128 620,128 640,192 
                C660,256 700,256 720,192 
                C740,128 780,128 800,192 
                C820,256 860,256 880,192 
                C900,128 940,128 960,192 
                C980,256 1020,256 1040,192 
                C1060,128 1100,128 1120,192 
                C1140,256 1180,256 1200,192 
                C1220,28 1260,128 1280,192
                C1300,256 1340,256 1360,192 
                C1380,128 1400,64 1440,64 
                L1440,320 L0,320 Z" /> 
              </svg>
          </div>
        </section>

        {/* ConnectPeople Section */}
        {/* <section className="bg-pink-400" >
          <ConnectPeople />
           <div className="w-full overflow-hidden leading-[0]">
                      <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-current text-[#fefae0]">
                        <path d="M0,64 
                                C60,80 80,160 100,192 
                                C120,224 140,224 160,192 
                                C180,160 200,64 240,64 
                                C280,64 300,128 320,192 
                                C340,256 380,256 400,192 
                                C420,128 460,128 480,192 
                                C500,256 540,256 560,192 
                                C580,128 620,128 640,192 
                                C660,256 700,256 720,192 
                                C740,128 780,128 800,192 
                                C820,256 860,256 880,192 
                                C900,128 940,128 960,192 
                                C980,256 1020,256 1040,192 
                                C1060,128 1100,128 1120,192 
                                C1140,256 1180,256 1200,192 
                                C1220,28 1260,128 1280,192
                                C1300,256 1340,256 1360,192 
                                C1380,128 1400,64 1440,64 
                                L1440,320 L0,320 Z" />
                      </svg>
            </div>  
        </section> */}

        {/* Commnity Section */}
        <section  className="bg-[#fefae0]"> 
          <JoinCommunity />
            <div className="w-full overflow-hidden leading-[0]">
                      <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-current text-[#FF6B6B]">
                        <path d="M0,64 
                                C60,80 80,160 100,192 
                                C120,224 140,224 160,192 
                                C180,160 200,64 240,64 
                                C280,64 300,128 320,192 
                                C340,256 380,256 400,192 
                                C420,128 460,128 480,192 
                                C500,256 540,256 560,192 
                                C580,128 620,128 640,192 
                                C660,256 700,256 720,192 
                                C740,128 780,128 800,192 
                                C820,256 860,256 880,192 
                                C900,128 940,128 960,192 
                                C980,256 1020,256 1040,192 
                                C1060,128 1100,128 1120,192 
                                C1140,256 1180,256 1200,192 
                                C1220,28 1260,128 1280,192
                                C1300,256 1340,256 1360,192 
                                C1380,128 1400,64 1440,64 
                                L1440,320 L0,320 Z" />
                      </svg>
            </div>
        </section>

         {/* Gallery Section */}
        <section className="bg-[#FF6B6B]">
          <Gallery />
             <div className="w-full overflow-hidden leading-[0]">
                      <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-current text-[#F7FFF7]">
                        <path d="M0,64 
                                C60,80 80,160 100,192 
                                C120,224 140,224 160,192 
                                C180,160 200,64 240,64 
                                C280,64 300,128 320,192 
                                C340,256 380,256 400,192 
                                C420,128 460,128 480,192 
                                C500,256 540,256 560,192 
                                C580,128 620,128 640,192 
                                C660,256 700,256 720,192 
                                C740,128 780,128 800,192 
                                C820,256 860,256 880,192 
                                C900,128 940,128 960,192 
                                C980,256 1020,256 1040,192 
                                C1060,128 1100,128 1120,192 
                                C1140,256 1180,256 1200,192 
                                C1220,28 1260,128 1280,192
                                C1300,256 1340,256 1360,192 
                                C1380,128 1400,64 1440,64 
                                L1440,320 L0,320 Z" />
                      </svg>
            </div>
        </section>

         {/* FooterSection */}
        <section className="bg-[#F7FFF7]">   
          <Footer />
        </section>
      </div>
    </>
  )
}

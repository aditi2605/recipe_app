'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

export default function Gallery() {
  const scrollRef1 = useRef(null)
  const scrollRef2 = useRef(null)

  useEffect(() => {
    const container1 = scrollRef1.current
    const container2 = scrollRef2.current

    let scrollAmount1 = 0
    let scrollAmount2 = 0
    let animationFrame1
    let animationFrame2

    const scrollContent1 = () => {
      if (container1 && !container1.matches(':hover')) {
        scrollAmount1 += 1
        if (scrollAmount1 >= container1.scrollWidth / 2) {
          scrollAmount1 = 0
        }
        container1.scrollLeft = scrollAmount1
      }
      animationFrame1 = requestAnimationFrame(scrollContent1)
    }

    const scrollContent2 = () => {
      if (container2 && !container2.matches(':hover')) {
        scrollAmount2 -= 1
        if (scrollAmount2 <= 0) {
          scrollAmount2 = container2.scrollWidth / 2
        }
        container2.scrollLeft = scrollAmount2
      }
      animationFrame2 = requestAnimationFrame(scrollContent2)
    }

    animationFrame1 = requestAnimationFrame(scrollContent1)
    animationFrame2 = requestAnimationFrame(scrollContent2)

    return () => {
      cancelAnimationFrame(animationFrame1)
      cancelAnimationFrame(animationFrame2)
    }
  }, [])

  const mediaItems = [
    { src: '/images/cook_pizza.jpg', type: 'image' },
    { src: '/images/cook_chicken.jpg', type: 'image' },
    { src: '/images/cook_pasta.jpg', type: 'image' },
    { src: '/images/cook_salad.jpg', type: 'image' },
    { src: '/images/bagel.jpg', type: 'image' },
      { src: '/videos/watermelon_mocktail.mp4', type: 'video' },
    { src: '/images/bagel_cooking.jpg', type: 'image' },
    { src: '/images/children_cooking_2.jpg', type: 'image' },
    // { src: '/videos/My_Recipe_book.mp4', type: 'video' },
    { src: '/images/cook_smoothie.jpg', type: 'image' },
    { src: '/images/cook_tacos.jpg', type: 'image' },
    { src: '/images/cook_cookie.jpg', type: 'image' },
    { src: '/images/cook_noodles.jpg', type: 'image' },
    { src: '/images/cook_pizza_2.jpg', type: 'image' },
    { src: '/images/cook_cake.jpg', type: 'image' },
    { src: '/videos/mocktail.mp4', type: 'video' },
  ]

  const mediaItems2 = [
    { src: '/images/cook_pizza.jpg', type: 'image' },
    { src: '/images/cook_vadapav.jpg', type: 'image' },
    { src: '/images/cook_pasta.jpg', type: 'image' },
    { src: '/images/dosa_platter.jpg', type: 'image' },
    // { src: '/videos/My_Recipe_book.mp4', type: 'video' },
    { src: '/images/cook_smoothie.jpg', type: 'image' },
    { src: '/images/cook_tacos.jpg', type: 'image' },
    { src: '/images/cook_cookie.jpg', type: 'image' },
    { src: '/videos/watermelon_mocktail.mp4', type: 'video' },
    { src: '/images/cook_noodles.jpg', type: 'image' },
    { src: '/images/cook_pizza_2.jpg', type: 'image' },
    { src: '/images/cook_cake.jpg', type: 'image' }, 
    { src: '/images/bagel.jpg', type: 'image' },
    { src: '/images/bagel_cooking.jpg', type: 'image' },
    { src: '/images/children_cooking_2.jpg', type: 'image' },
    { src: '/videos/mocktail.mp4', type: 'video' },
    { src: '/images/children_cooking.jpg', type: 'image' },
  ]

  return (
    <section id="gallery">

      <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-12">
        Explore Delicious Stories 🎞️
      </h2>

      {/* First Row */}
      <div
        ref={scrollRef1}
        className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide mb-12"
      >
        <div className="flex gap-6 px-6">
          {mediaItems.map((item, index) => (
            <div
              key={`row1-${index}`}
              className="min-w-[220px] h-[300px] rounded-[40px] overflow-hidden shadow-xl bg-white hover:scale-105 transition-transform duration-300"
            >
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={`Media ${index}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Second Row (reverse scroll) */}
      <div
        ref={scrollRef2}
        className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide"
      >
        <div className="flex gap-6 px-6">
          {mediaItems2.map((item, index) => (
            <div
              key={`row2-${index}`}
              className="min-w-[220px] h-[300px] rounded-[40px] overflow-hidden shadow-xl bg-white hover:scale-105 transition-transform duration-300"
            >
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={`Media ${index}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

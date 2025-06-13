'use client'
import Image from 'next/image'
import Nav from '../components/Nav.jsx'

export default function Home() {
  return (
    <>
        {/* nav */}
        <Nav />
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 p-12 bg-gradient-to-br from-green-600 to-green-700 min-h-screen">
            {/* left section */}
            <div className="leftsection m-24 lg:w-1/2 text-center lg:text-left">
                <span className="text-white text-md">
                Over 5,000+ home chefs trust our platform. Start your flavor journey today!
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">
                Discover Flavors from Every Corner of the World
                </h1>
                <p className="mt-4 text-xl text-white/90">
                From timeless classics to modern twists — explore, save, and cook recipes that bring joy to every bite.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-100 transition">
                        Browse Recipes
                    </button>
                    <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-green-700 transition">
                        Submit Your Own
                    </button>
                </div>

                </div>
            </div>
            {/* Video section */}
            <div className="relative w-[380px] h-[650px] rounded-[2rem] border-4 border-black overflow-hidden shadow-xl">
        
                    <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover "
                >
                    <source src="/videos/My_Recipe_Book.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                </div>
                
        </div>
    </>
  )
}

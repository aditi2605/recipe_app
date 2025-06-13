'use client'
import Image from 'next/image'
import Logo from '../../public/images/logo_1.jpg'

export default function Nav() {
  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-br from-green-600 to-green-700 shadow-md flex-wrap">

      {/* Logo */}
      <div className="flex items-center flex-shrink-0 mr-4">
        <Image
          src={Logo}
          alt="logo"
          width={60}
          height={40}
          className="rounded-md"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 items-center justify-center">
        <button className="px-4 py-2 border border-white text-white font-semibold rounded-lg hover:bg-green-700 transition text-sm sm:text-base">
          Login
        </button>
        <button className="px-4 py-2 border border-white text-white font-semibold rounded-lg hover:bg-green-700 transition text-sm sm:text-base">
          Signup
        </button>
      </div>
    </nav>
  )
}

'use client'

import Image from 'next/image'
import Logo from '../../public/images/bite_cult_logo.png'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Heart, PlusCircle, LogOut, ScrollText } from 'lucide-react'
import NavItem from './NavItem'

export default function DashboardSideNav({ onSelect }) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const isOpen = isHovered

  return (
    <div
      className={`h-screen transition-all duration-300 ease-in-out flex flex-col p-4 z-50
        ${isOpen ? 'w-60' : 'w-20'}
        bg-amber-200 text-[#F7FFF7]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className='w-14 h-14 rounded-full border-4 border-amber-300 shadow-ld bg-pink-300 flex items-center justify-center mb-4'
          >
              <Image 
                src={Logo}
                alt="Bite Cult Logo"
                width={160}
                height={80}
                className='"rounded-full'
              />
          </motion.div>

      <hr className="border-[#FF6B6B] mb-6" />

      {/* Nav Items */}
      <div className="flex flex-col gap-4 font-medium text-[#FF6B6B] font-bold">
        <NavItem
          onClick={() => onSelect('dashboard')}
          icon={<LayoutDashboard />}
          label="Dashboard"
          showLabel={isOpen}
          className="text-[#FF6B6B] font-semibold"
        />
        <NavItem
          onClick={() => onSelect('favorites')}
          icon={<Heart />}
          label="Favorites"
          showLabel={isOpen}
          className="text-[#F7FFF7]"
        />
        <NavItem
          onClick={() => onSelect('addrecipe')}
          icon={<PlusCircle />}
          label="Add Recipe"
          showLabel={isOpen}
          className="text-[#F7FFF7]"
        />
         <NavItem
          onClick={() => onSelect('createdRecipes')}
          icon={<ScrollText/>}
          label="My Recipes"
          showLabel={isOpen}
          className="text-[#F7FFF7]"
        />
        <NavItem
          onClick={() => router.push('/')}
          icon={<LogOut />}
          label="Logout"
          showLabel={isOpen}
          className="text-[#F7FFF7]"
        />
      </div>
    </div>
  )
}

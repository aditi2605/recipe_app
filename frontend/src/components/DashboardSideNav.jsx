'use client'

import Image from 'next/image'
import Logo from '../../public/images/logo_3.jpg'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Menu, LayoutDashboard, Heart, PlusCircle, LogOut} from 'lucide-react'
import NavItem from './NavItem'

export default function DashboardSideNav( { onSelect }){
    const [isOpen, setIsOpen] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth < 768){
                setIsOpen(false)
            }else {
                setIsOpen(true)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className={`h-screen bg-green-700 text-white flex flex-col transition-all duration-300 ${isOpen ? 'w-60': 'w-20'} p-4`}>
            {/* Logo */}
                <div className="flex items-center justify-between">
                    <div className='hidden md:block'>
                        <Image
                            src={Logo}
                            alt="logo"
                            width={40}
                            height={40}
                            className="rounded-md xl:hidden"
                        />
                    </div>
                    
                    <button onClick={() => setIsOpen(!isOpen)} className='text-white sm:hidden'>
                        <Menu />
                    </button>
                </div>
                    <hr className='border-white my-6' />

                    <div className='flex flex-col mt-4 gap-4'>
                        <NavItem onClick={() => onSelect('dashboard')} icon={<LayoutDashboard />} label="Dashboard" showLabel={isOpen} />
                        <NavItem onClick={() => onSelect('favorites')} icon={<Heart />} label="Favorites" showLabel={isOpen} />
                        <NavItem onClick={() => onSelect('addrecipe')} icon={<PlusCircle/>} label="Add Recipe" showLabel={isOpen} />
                        <NavItem onClick={() => router.push('/')}icon={<LogOut />} label="Logout" showLabel={isOpen} />
                       

                    </div>
            
                
        </div>
    )
}
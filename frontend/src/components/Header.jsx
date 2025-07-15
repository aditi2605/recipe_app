'use client'

import { useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import { Search, Settings, Lock, BellDot, Info, Heart  } from 'lucide-react'
import Logo from '../../public/images/profile_img.jpg'
import Image from 'next/image'


export default function Header({ handleSearchSubmit, handleViewRecipe, handleAddToFavorites, searchQuery, setSearchQuery}) {
    const [search, setSearch] = useState("")
    const [username, setUsername] = useState("")
    const [profileCard, setProfileCard] = useState(false)
    

    const closeModal = () => {
        setProfileCard(false)
    }

     const handleClick = () => {
        setProfileCard(true)

    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const handleKeyDown = (e) => {
        if (e.key == 'Enter'){
            handleSearchSubmit(search)
            setSearch("")
        }
    }

    useEffect(() => {
        const fetchUsername = async () => {
            try{
                const token = localStorage.getItem("token");
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verified`,
                    {
                        method: "GET",
                        headers: 
                        {
                             'Authorization': `Bearer ${token}`,
                        }
                    }
                )
                
                if (response.ok){
                    const data = await response.json()
                    console.log("header username:", data)
                    setUsername(data.message)
                }
            } catch(err){
                console.error('Faield to fetch username', err)
            }
        }
        fetchUsername()

    }, [])

    


    return (
     <div className=" flex flex-row items-center py-4 items-right justify-between gap-4 w-full px-4 py-2">
        <div className="relative w-full md:w-1/2">
            <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-pink-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What do you want to eat today?"
                    className="w-full pl-10 pr-4 py-2 bg-white text-pink-500 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
        </div>
        <div className="flex-shrink-0">
            <Image
                src={Logo}
                alt="logo"
                width={60}
                height={40}
                className="rounded-full"
                onClick={handleClick}
            />
            
        </div>

        {profileCard && (
            <div className='fixed flex inset-0 bg-white/50 w-full justify-center items-center z-50 px-4'>
                <div className="bg-[#F7FFF7] border border-[#FF6B6B] w-full max-w-md rounded-2xl p-6 relative shadow-2xl justify-ceneter items-center">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-[#FF6B6B] text-2xl font-bold hover:scale-110 transition"
                >
                    ✕
                </button>
                
                <div className="flex flex-col justify-center items-center">
                     <Image
                        src={Logo}
                        alt="logo"
                        width={100}
                        height={40}
                        className="rounded-full"
                        
                    />
                
                    <h2 className="text-2xl font-bold text-center mb-6 text-[#FF6B6B] mt-2">
                        {getGreeting()}, {username}
                    </h2>
                    <ul className=''>
                        <li className='my-2 gap-2 flex text-lg text-[#FF6B6B] '><Settings />Settings</li>
                        <li className='my-2 gap-2 flex text-lg text-[#FF6B6B] '><Lock />Privicy & Policy</li>
                        <li className='my-2 gap-2 flex text-lg text-[#FF6B6B] '><BellDot />Notification</li>
                        <li className='my-2 gap-2 flex text-lg text-[#FF6B6B] '><Info />Help</li>
                        <li className='my-2 gap-2 flex text-lg text-[#FF6B6B] '><Heart />Invite a friend!</li>
                    </ul>
                
                </div>
                    
                </div>

            </div>

        )}

      
    </div>
    )
}

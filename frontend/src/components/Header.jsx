'use client'

import { useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import Logo from '../../public/images/logo_3.jpg'
import Image from 'next/image'

export default function Header() {
    const [search, setSearch] = useState("")
    const [username, setUsername] = useState("")

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

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
     <div className="bg-white shadow-md rounded-xl border border-green-100 px-8 py-4 flex flex-col lg:flex-row justify-between items-center gap-6 w-full">
        
         {/* Left: Logo + Brand */}
        <div className="flex items-center gap-4">
              <Image
                      src={Logo}
                      alt="logo"
                      width={60}
                      height={40}
                      className="rounded-md"
                    />
            <div>
            <h1 className="text-2xl font-bold text-green-800">Recipe Book</h1>
            <p className="text-sm text-green-800">Your personalized recipe dashboard 🍱</p>
            </div>
        </div>

        {/* Center: Greeting */}
        <div className="text-center lg:text-left">
            <h2 className="text-xl font-semibold text-green-800">
            🍽️ {getGreeting()}, <span className="italic text-green-900">{username}</span>
            </h2>
        </div>

        {/* Right: Search */}
        <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-green-600" />
            <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
            className="pl-10 pr-4 py-2 w-full bg-white text-green-900 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
        />
        </div>
        
    </div>
    )
}

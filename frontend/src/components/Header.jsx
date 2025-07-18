'use client'

import { useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import { Search, Settings, Lock, BellDot, Info, Heart, Pencil  } from 'lucide-react'
// import Logo from '../../public/images/profile_img.jpg'
import Image from 'next/image'


export default function Header({ handleSearchSubmit, handleViewRecipe, handleAddToFavorites, searchQuery, setSearchQuery}) {
    const [search, setSearch] = useState("")
    const [userName, setUserName] = useState("")
    const [profileCard, setProfileCard] = useState(false)
    const [profileImage, setProfileImage] = useState('/images/profile_img.jpg')
    const [profileImageUrl, setProfileImageUrl] = useState('/images/profile_img.jpg')
    

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

    // fetch profile image
   
        const fetchProfileImage = async() => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profileimage`,
                    {
                        method: 'GET',
                        headers: { 'Authorization' : `Bearer ${token}`}

                    }
                )

                if (response.ok){
                    const data = await response.json()
                    console.log("profileimage:", data)

                     if (data.image){
                        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${data.image}`;
                        setProfileImage(imageUrl)
                    } else {
                        fetchProfileImage()
                    }
                    
                }
            }catch(err){
                console.error('Faield to fetch username', err)
            }
        }
        
        
     useEffect(() => {
        fetchProfileImage()
     }, [])

     // upload profile image
    const handleFileSelect = async(e) => {
        const file = e.target.files[0];
        if(!file) {
            console.error("No file selected");
            return;
        }
        const formData = new FormData()
        formData.append('image', file)

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profileimage`,
                {
                    method: 'POST',
                    body: formData,
                    headers: { Authorization: `Bearer ${token}`,},
                })

                 const data = await response.json()
                 console.log("profile photo uploaded", data)

                 if (data.image) {
                    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${data.image}?t=${Date.now()}`
                    setProfileImage(imageUrl)
                 } else {
                    setTimeout(() => fetchProfileImage(), 1000)
                 }    
            } catch(err) {
                console.error("Failed to upload profile image", err)
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
                    setUserName(data.message)
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
        <div className="relative flex-shrink-0 w-[60px] h-[60px]">
            
            <Image
                src={profileImage}
                alt="profileimage"
                fill
                className="rounded-full object-cover border-4 border-amber-300 shadow-xl"
                onClick={handleClick}
                  
            />
           
        </div>

        {profileCard && (
            <div className='fixed flex inset-0 bg-white/75 w-full justify-center items-center z-50 px-4 shadow-2xl'>
                <div className="bg-[#F7FFF7] border border-[#FF6B6B] w-full max-w-md rounded-2xl p-6 relative shadow-2xl justify-ceneter items-center">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-[#FF6B6B] text-2xl font-bold hover:scale-110 transition"
                >
                    ✕
                </button>
                
                <div className="flex flex-col justify-center items-center">
                    <div className="relative flex-shrink-0 w-[60px] h-[60px]">
            
                        <Image
                            src={profileImage}
                            alt="profileimage"
                            fill
                            className="rounded-full object-cover border-4 border-[#FF6B6B] shadow-xl"
                            onClick={handleClick}
                            
                        />
                        
                        <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer">
                            <Pencil className="w-5 h-5 text-black" />
                            <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e)}
                            className="hidden"
                            />
                        </label>
                        
                    </div>
                
                    <h2 className="text-2xl font-bold text-center mb-6 text-[#FF6B6B] mt-2">
                        {getGreeting()}, {userName}
                    </h2>
                    <ul className=''>
                        <li className='my-2 gap-2 flex text-lg text-[#FF6B6B] '><Lock />Privicy & Policy</li>
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

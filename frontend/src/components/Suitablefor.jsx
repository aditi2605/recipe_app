'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart } from 'lucide-react'

export default function SuitableFor({ onViewRecipe, filters, favourites }) {

    const [hasSelected, setHasSelected] = useState(false)

    const [recipes, setRecipes] = useState([])

    useEffect(()=> {
        const activeFilters = Object.keys(filters).filter(key => filters[key])
        if (activeFilters.length === 0) {
            setRecipes([])
            setHasSelected(false)
            return 
        }

        const fetchSuitablefor = async() => {
            try{
                const filterQuery = activeFilters.map(f => `suitable_for=${f}`).join("&")
                const response = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/recipes/suitablefor/?${filterQuery}`, 
                    {
                        method: 'GET',
                        headers: {'Content-Type' : 'Application/json'},

                    })

                    if(response.ok) {
                        const data = await response.json()
                        console.log("suitabledata", data)
                        setRecipes(data)
                        setHasSelected(true)
                    }
            } catch(err){
                console.error("Failed to fetch suitablefor data", err)
            }
        }
        fetchSuitablefor()
    },[filters])


    
    return (
        <>
            <div className="w-full px-4 md:px-10 space-y-16">
                <section>
                    {hasSelected ? (
                        recipes.length > 0 ? (
                        <>
                            <h2 className='text-2xl text-green-800 mb-4 font-bold'>Reciepes</h2>
                            <div className="overflow-x-auto pb-4 hide-scrollbar">
                                <div className="flex space-x-4">
                                {Array.isArray(recipes) && recipes.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ scale: 1.03 }}
                                        className="min-w-[280px] md:min-w-[320px] bg-white/80 backdrop-blur-lg border border-green-800 rounded-3xl transition-transform duration-300 relative overflow-hidden group"
                                    >
                                    {/* Recipe Image */}
                                    <div className="relative w-full h-56 sm:h-64">
                                        <Image
                                            src={`http://localhost:8000/uploads/${item.image}`}
                                            alt={item.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-t-3xl group-hover:scale-105 transition-transform duration-300"
                                        />

                                         {/* Tag */}
                                        <div className="absolute top-3 left-3 bg-green-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                        🌟 {item.suitable_for}
                                        </div>
                                
                                        {/* Cooking Time */}
                                        <div className="absolute top-3 right-3 bg-green-800 text-white text-xs  px-2 py-1 rounded-full shadow flex items-center gap-1">
                                            ⏱ {item.cooking_time} min
                                        </div>
                                    </div>
                                
                                    {/* Content */}
                                    <div className="p-4 space-y-1 relative">
                                        <h3 className="text-xl font-bold text-green-800 ">{item.title}</h3>
                                
                                        <div className='flex flex-row justify-between'>
                                            {/* Cuisine */}
                                            <span className="inline-block text-md bg-green-800 text-white px-4 py-2 rounded-full mt-1">
                                                🍽 {item.origin}
                                            </span>
                                
                                            {/* SuitableFor */}
                                            <span className="inline-block text-md text-bold bg-green-800 text-white px-4 py-2 rounded-full mt-1">
                                                🍽 {item.suitable_for}
                                            </span>
                                        </div>
                                
                                        {/* Buttons */}
                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                onClick={() => onViewRecipe(item.id)}
                                                className="px-4 py-2 bg-green-800 text-white text-md rounded-full hover:bg-green-700 transition"
                                            >
                                                View Recipe
                                            </button>
                                
                                            {/* Heart button */}
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                className="text-pink-600 hover:text-pink-500"
                                                onClick={() => handleAddToFavorites(item.id)}
                                            >
                                                <Heart className={`w-6 h-6 ${favourites.includes(item.id) ? 'fill-pink-600' : ''}`} />
                                            </motion.button>
                                            </div>
                                        </div>
                                        </motion.div>
                                
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className='text-3xl text-red-500 items-center text-center m-12'>Sorry, No recipe found ☹️ </p>
                    )

                    ): null}
                    
                </section>
            </div>
        
        </>
    )
}
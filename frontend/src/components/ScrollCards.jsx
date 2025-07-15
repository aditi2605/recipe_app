'use client'

import {useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {  Heart } from 'lucide-react'

export default function ScrollCards({ onViewRecipe, handleAddToFavorites , favourites }) {

    const [recipes, setRecipe] = useState([])
    const router = useRouter()
   

    // fetch recipes
    useEffect(() => {
        const fetchReipes = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`, 
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json'},
                    })
                    const data = await response.json()
                    console.log("Recipe data", data)
                    setRecipe(data)
            }catch(err){
                console.error("Failed to fetch recipes", err)

            }
        }
        fetchReipes()
    }, [])

    // Post Favorite Recipes to Favorite page
    // const handleAddToFavorites = async (recipeId) => {
    //     try {
    //         const token = localStorage.getItem("token");

    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({ recipe_id: recipeId }),
    //         });

    //         console.log("Sending token:", token);

    //         if (response.ok) {
    //         setFavourites(prev => [...prev, recipeId]);
    //         } else {
    //         const errorData = await response.json();
    //         console.error("Failed to add favorite:", errorData);
    //         }
    //     } catch (err) {
    //         console.error("Error while adding favorite", err);
    //     }
    // };

       

    
    return (
        <div className="w-full px-4 md:px-10 py-12 space-y-16">
            {/* Recommended Recipes */}
            <section>
                <h2 className="text-2xl font-bold text-[#FF6B6B] mb-4">Recommended Recipes 🥙</h2>
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                    <div className="flex space-x-4">
                        {Array.isArray(recipes) && recipes.map((item) => (
                            item.tag === 'recommended' ? (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.03 }}
                                className="min-w-[280px] md:min-w-[320px] bg-white/80 backdrop-blur-lg border border-red-100 rounded-3xl transition-transform duration-300 relative overflow-hidden group"
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
                                    <div className="absolute top-3 left-3 bg-[#FF9F1C] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                    🌟 Recommended
                                    </div>

                                    {/* Cooking Time */}
                                    <div className="absolute top-3 right-3 bg-white text-[#FF6B6B] text-xs font-semibold px-2 py-1 rounded-full shadow flex items-center gap-1">
                                    ⏱ {item.cooking_time} min
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-1 relative">
                                    <h3 className="text-xl font-bold text-[#FF6B6B]">{item.title}</h3>

                                    <div className='flex flex-row justify-between'>
                                        {/* Cuisine */}
                                        <span className="inline-block text-md bg-red-100 text-[#FF6B6B] px-4 py-2 rounded-full mt-1">
                                        🍽 {item.cuisine}
                                        </span>

                                        {/* SuitableFor */}
                                        <span className="inline-block text-md bg-red-100 text-[#FF6B6B] px-4 py-2 rounded-full mt-1">
                                        🍽 {item.suitable_for}
                                        </span>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-between items-center mt-4">
                                    <button
                                        onClick={() => onViewRecipe(item.id)}
                                        className="px-4 py-2 bg-[#FF9F1C] text-white text-md rounded-full hover:bg-green-700 transition"
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
                            ) : null
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Recipes */}
            <section>
                <h2 className="text-2xl font-bold text-pink-700 mb-4">Trending Recipes 📸</h2>
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                    <div className="flex space-x-4">
                          {Array.isArray(recipes) && recipes.map((item) => (
                            item.tag === 'trending' ? (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.03 }}
                                className="min-w-[280px] md:min-w-[320px] bg-white/80 backdrop-blur-lg border border-green-100 rounded-3xl transition-transform duration-300 relative overflow-hidden group"
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
                                    <div className="absolute top-3 left-3 bg-amber-300 text-pink-700 text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                     📸 Trending
                                    </div>

                                    {/* Cooking Time */}
                                    <div className="absolute top-3 right-3 bg-white text-pink-700 text-xs px-2 py-1 rounded-full shadow flex items-center gap-1">
                                    ⏱ {item.cooking_time}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-1 relative">
                                    <h3 className="text-xl font-bold text-green-800">{item.title}</h3>
                                    
                                      <div className='flex flex-row justify-between'>

                                        {/* Cuisine */}
                                        <span className="inline-block text-md bg-pink-700 text-white px-4 py-2 rounded-full mt-1">
                                        🍽 {item.cuisine}
                                        </span>

                                        {/* SuitableFor */}
                                        <span className="inline-block text-md bg-pink-700 text-white px-4 py-2 rounded-full mt-1">
                                        🍽 {item.suitable_for}
                                        </span>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-between items-center mt-4">
                                    <button
                                        onClick={() => onViewRecipe(item.id)}
                                        className="px-4 py-2 bg-green-800 text-white text-md rounded-full hover:bg-pink-700 transition"
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
                            ): null
                        ))}
                    </div>
                </div>
            </section>
    </div>

    )
}
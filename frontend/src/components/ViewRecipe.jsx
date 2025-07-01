'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { X, ThumbsUp, ThumbsDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ViewRecipe({ recipeId, setSelectedView }) {
  const [recipe, setRecipe] = useState(null)
  const [reactionType, setReactionType] = useState(null)
  
  const router = useRouter()

  const handleRedirect = () => {
        setSelectedView('dashboard')
    }

  useEffect(() => {
    if (!recipeId) return

    const recipeById = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()
        console.log("recipe by id:", data)
        setRecipe(data)
      } catch (err) {
        console.error("Failed to fetch recipe", err)
      }
    }

    recipeById()
  }, [recipeId])

// Patch like\dislike reaction api

//   load previous reaction from localstorage
useEffect( () => {
    const savedReaction  = localStorage.getItem(`reaction_${recipeId}`)
    if (savedReaction) {
        setReactionType(savedReaction)
    }
}, [recipeId])

  const handleRection = async (type) => {
    if (!recipeId || !type) return 

    const existingReaction = localStorage.getItem(`reaction_${recipeId}`)

    if(existingReaction === type) {
        alert(`You already ${type}d this recipe.`)
        return 
    }

    try {
    // Undo the previous reaction
        if (existingReaction) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeId}/${existingReaction}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        })
        }

        // Apply the new reaction
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeId}/${type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        })

        const updated = await res.json()
        setRecipe(updated)
        setReactionType(type)
        localStorage.setItem(`reaction_${recipeId}`, type)

    } catch (err) {
        console.error(`Failed to ${type} recipe`, err)
    }
  } 



  if (!recipe) return (
    <div className='flex justify-center items-center min-h-screen'>
      <p className='text-lg font-medium text-gray-600'>Loading recipe...</p>
    </div>
  )

  return (
   <section className="flex flex-col lg:flex-row bg-gradient-to-r from-green-50 via-yellow-50 to-pink-50 shadow-inner justify-center items-center px-4 py-10 sm:px-6 lg:px-12">
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="relative w-full max-w-4xl bg-white/80 backdrop-blur-lg border border-green-100 rounded-3xl shadow-xl transition-all duration-300 overflow-hidden"
  >
    {/* Close Button */}
    <button
      onClick={handleRedirect}
      className="absolute top-4 right-4 z-10 text-gray-800 bg-white/90 hover:bg-red-100 rounded-full p-2 shadow-md transition"
      aria-label="Close"
    >
      <X className="w-5 h-5" />
    </button>

    {/* Image Section */}
    <div className="relative w-full h-72 sm:h-96 rounded-t-3xl overflow-hidden">
      <Image
        src={`http://localhost:8000/uploads/${recipe.image}`}
        alt={recipe.title}
        fill
        className="object-cover"
      />
      <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Reactions */}
      <div className="absolute bottom-4 right-4 flex gap-3">
        <button
          onClick={() => handleRection('like')}
          className="text-white bg-green-500 hover:bg-green-600 rounded-full p-2 shadow transition"
          aria-label="Like"
        >
          <ThumbsUp className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleRection('dislike')}
          className="text-white bg-red-400 hover:bg-red-500 rounded-full p-2 shadow transition"
          aria-label="Dislike"
        >
          <ThumbsDown className="w-5 h-5" />
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="p-6 md:p-8 space-y-6">
      <h2 className="text-3xl font-extrabold text-green-800 flex items-center gap-2">
        🍽️ {recipe.title}
      </h2>

      <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-800">
        <p><span className="font-semibold">⏱ Cooking Time:</span> {recipe.cooking_time}</p>
        <p><span className="font-semibold">🌍 Cuisine:</span> {recipe.cuisine}</p>
        <p><span className="font-semibold">👥 Serves:</span> {recipe.serves}</p>
        <p><span className="font-semibold">🧘 Suitable For:</span> {recipe.suitable_for}</p>
        <p><span className="font-semibold">🍽️ Category:</span> {recipe.category}</p>
        {recipe.nutrition && (
          <p><span className="font-semibold">🥦 Nutrition:</span> {recipe.nutrition}</p>
        )}
        <p><span className="font-semibold">👍 Likes:</span> {recipe.likes}</p>
        <p><span className="font-semibold">👎 Dislikes:</span> {recipe.dislikes}</p>
      </div>
      
      <div className="space-y-3 text-gray-700 mt-6">
        <p><span className="font-semibold">📝 Ingredients:</span> {recipe.ingredients}</p>
        <p><span className="font-semibold">👨‍🍳 Instructions:</span> {recipe.instructions}</p>
        {recipe.substitution && (
          <p><span className="font-semibold">🔄 Substitution:</span> {recipe.substitution}</p>
        )}
      </div>
    </div>
  </motion.div>
</section>

  )
}

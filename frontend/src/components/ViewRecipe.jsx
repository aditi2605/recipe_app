'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { X, Clock, UsersRound, Flame, Layers } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ViewRecipe({ recipeId, setSelectedView }) {
  const [recipe, setRecipe] = useState(null)
  const [reactionType, setReactionType] = useState(null)
  
  const router = useRouter()

  const handleRedirect = () => {
        setSelectedView('dashboard')
    }

  const highlightAmount = (item) =>
    item.replace(/^\s*([\d\/\s\w.]+)(?=\s)/, "<strong>$1</strong>");

  const InfoBadge = ({ icon, label }) => (
    <div className="flex flex-col items-center justify-start pt-2 w-18 h-32 shadow-xxl bg-amber-300 text-[#FF6B6B] rounded-full shadow-xl">
      <span className="text-4xl text-center bg-white rounded-full w-14 h-14 py-2 px-2 m-1">{icon}</span>
      <span className="text-xs font-bold text-black text-center py-2 px-2">{label}</span>
    </div>
  );

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
        console.log("updated:", updated)
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
   <section className="flex flex-col items-center px-4 py-8 min-h-screen">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Recipe Image */}
        <div className="relative w-full h-96">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${recipe.image}`}
            // src={`http://localhost:8000/uploads/${recipe.image}`}
            alt={recipe.title}
            fill
            className="object-cover"
          />
          <button
            onClick={handleRedirect}
            className="absolute top-4 left-4 bg-[#FF6B6B] rounded-full p-2 shadow"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Recipe Content */}
        <div className="p-6">
          {/* Title & Cuisine */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{recipe.title}</h2>
              <p className="text-gray-500">{recipe.origin}</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-300 text-black px-3 py-1 rounded-full text-sm font-bold shadow-xl">
              ⭐ {recipe.rating || '4.5'}
            </div>

          </div>

          {/*  Badges */}
          <div className="flex flex-wrap gap-1 my-2 text-black justify-center items-center">
            <InfoBadge className='text-black' icon={<Clock className='w-10 h-8 text-black' />} label={`${recipe.cooking_time} min`} />
            <InfoBadge icon={<UsersRound className='w-10 h-8 text-black'  />} label={`${recipe.serves} Serving`} />
            <InfoBadge icon={<Flame className='w-10 h-8 text-black'  />} label={`${recipe.calories} Cal`} />
            <InfoBadge icon={<Layers className='w-10 h-8 text-black'  />} label={`${recipe.difficulty || 'Easy'}`} />
          </div>

          {/* Ingredients */}
          <div className="mt-6">
            <h3 className="font-bold mb-2 text-black">Ingredients</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {recipe.ingredients.split(',').map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: highlightAmount(item) }} />
              ))}
            </ul>
          </div>

          {/* Directions */}
          <div className="mt-6">
            <h3 className="font-bold mb-2 text-black">Instructions</h3>
            <p className="text-gray-700">{recipe.instructions}</p>
          </div>

          {/* Substitute */}
          <div className="mt-6">
            <h3 className="font-bold mb-2 text-black">Substitute</h3>
            <p className="text-gray-700">{recipe.substitution}</p>
          </div>

          {/* Tips */}
          <div className="mt-6">
            <h3 className="font-bold mb-2 text-black">Tips</h3>
            <p className="text-gray-700">{recipe.tips}</p>
          </div>

          {/* Nutrition */}
          <div className="mt-6">
            <h3 className="font-bold mb-2 text-black">Nutrition</h3>
            <p className="text-gray-700">{recipe.calories} cal</p>
            <p className="text-gray-700">{recipe.sugar} sugar</p>
            <p className="text-gray-700">{recipe.fat} fat</p>
            <p className="text-gray-700">{recipe.carbs} carbs</p>
            <p className="text-gray-700">{recipe.protine} protine</p>
          </div>

          {/* Suitable For */}
          <div className="mt-6">
            <h3 className="font-bold mb-2 text-black">Suitable For</h3>
            <p className="text-gray-700">{recipe.suitable_for}</p>
          </div>

          {/* Likes & Dislikes */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-green-600 font-bold">
              👍 {recipe.likes || 0} Likes
            </div>
            <div className="flex items-center gap-2 text-red-600 font-bold">
              👎 {recipe.dislikes || 0} Dislikes
            </div>
          </div>

           {/* recipeby tag */}
            {recipe.username && (
                <div className="absolute bottom-3 right-3 bg-white/30 backdrop-blur-sm border border-[#FF6B6B] rounded-lg text-[#FF6B6B] text-md font-extrabold px-4 py-2 shadow-lg">
                    RecipeBy : {recipe.username}
                </div>
            )}
        </div>
      </div>
    </section>


  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Trash } from 'lucide-react'

export default function Favorites({ onViewRecipe}) {
  const [myFavorite, setMyFavorite] = useState([])
  const router = useRouter()

  useEffect(() => {
    const getFavRecipes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await response.json()
        console.log("Fav Data:", data)
        setMyFavorite(data)
      } catch (err) {
        console.error(`Failed to fetch Fav Recipe `, err)
      }
    }
    getFavRecipes()
  }, [])

  const removeUnfavorites = async (recipeId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        setMyFavorite(prev => prev.filter(r => r.id !== recipeId))
      } else {
        console.error("Failed to remove from favorites")
      }
    } catch (err) {
      console.error("Error removing favorite", err)
    }
  }

  return (
    <>
      <section className='py-8 px-4 sm:px-6 lg:px-12'>
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          My Favorite Recipes ❤️
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myFavorite.length > 0 ? (
            myFavorite.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-3xl shadow-md hover:shadow-lg transform transition duration-300 overflow-hidden relative"
              >
                <div className="relative w-full h-56 sm:h-64 md:h-72">
                  <Image
                    src={`http://localhost:8000/uploads/${item.image}`}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-3xl"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent rounded-b-3xl" />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold text-green-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">Delicious and easy to cook at home!</p>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => onViewRecipe(item.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition"
                    >
                      View Recipe
                    </button>
                    <button onClick={() => removeUnfavorites(item.id)}>
                      <Trash className='w-5 h-5 text-red-600 hover:text-red-700' />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              You haven’t saved any recipes yet! 🍽️ <br />
              <span className="text-green-800 font-semibold">
                “Don’t let your taste buds get bored — add some favorites now!”
              </span>
            </p>
          )}
        </div>
      </section>
    </>
  )
}

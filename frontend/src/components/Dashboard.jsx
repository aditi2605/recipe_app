'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardSideNav from './DashboardSideNav'
import Header from './Header'
import ScrollCards from './ScrollCards'
import Favorites from './Favorites'
import CreateRecipe from './CreateRecipe'
import ViewRecipe from './ViewRecipe'
import SearchedRecipe from './SearchedRecipe'
import SuitableFor from './Suitablefor'
import Cuisine from './Cuisine'


export default function Dashboard( ) {
  const [selectedView, setSelectedView] = useState('dashboard')
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("")
  const [favourites, setFavourites] = useState("")
  const [show, setShow] = useState(true)
  const [searchInput, setSearchInput] = useState("")

  const handleViewRecipe = (id) => {
    setSelectedRecipeId(id)
    setSelectedView('viewRecipe')
  }

  const handleClearSearch = () => {
    setSearchInput("")
  }


     // Post Favorite Recipes to Favorite page
    const handleAddToFavorites = async (recipeId) => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found — user must log in")
          return
        }

        console.log("Adding favorite for recipeId:", recipeId)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ recipe_id: recipeId })
        })

        console.log("Token:", token)
        console.log("Request body:", { recipe_id: recipeId })

        if (response.ok) {
          console.log("Favorite added!")
          setFavourites(prev => [...prev, recipeId])
        } else {
          const text = await response.text()
          console.error("Failed to add favorite:", text)
        }
      } catch (err) {
        console.error("Error while adding favorite", err)
      }
    }

    useEffect(() => {
      const timer = setTimeout(() => {
        setShow(false)
      }, 5000)
      return () => clearTimeout(timer)
    }, [])

    // suitable_for

    const [filters, setFilters] = useState({
        vegan: false,
        vegetarian: false,
        nonveg:false,
        glutenfree: false,
    })

    const handleToggle = (type) => {
        setFilters(prev => ({
            ...prev,
            [type]: !prev[type],
        }))
    }

   
 

  return (
    <div className="flex h-screen overflow-hidden bg-amber-50">
      {/* Sidebar */}
      <DashboardSideNav onSelect={setSelectedView} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}     
        {selectedView === 'dashboard' && (
          <motion.div layout className="flex flex-col items-center justify-start bg-amber-50 px-4 pt-4">
            <Header handleViewRecipe={handleViewRecipe} searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
              handleSearchSubmit={(value) => {
                setSearchQuery(value)
                setSelectedCuisine("")
                setFilters({
                  vegan: false,
                  vegetarian: false,
                  nonveg: false,
                  glutenfree: false
                })
              }} 
            />

            {/* Toast message */}         
            <AnimatePresence mode="wait">
              {show ? (
                <motion.div
                  key="toast"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto mt-4 mb-6 bg-pink-400 m-2 text-amber-200 px-4 py-3 rounded-full shadow-md text-sm flex items-center gap-2 w-fit"
                >
                  🧑‍🍳 <span className="italic">Welcome back, Foodie!</span>{' '}
                  Let’s whip up something tasty today.
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  layout
                  className="h-4 mb-4"
                />
              )}
            </AnimatePresence>

           
            {/* Cuisine Buttons */}
            <motion.div layout className="overflow-x-auto pb-4 w-full relative z-10 hide-scrollbar">
              <div className="flex space-x-4 justify-center items-center">
                <ul className="flex w-max gap-4">
                  {[
                    '🍱  Indian',
                    '🍣  Japanese',
                    '🍚  Greek',
                    '🍜  Asian',
                    '🍕  Italian',
                    '🍤  Spanish',
                    '🍔  American',
                  ].map((label, index) => (
                    <li
                      key={index}
                      onClick={() => {setSelectedCuisine(label.trim().split(' ')[2]); setSearchQuery("");
                      setFilters({
                        vegan: false,
                        vegetarian: false,
                        nonveg: false,
                        glutenfree: false
                      });
                    }}
                      className="min-w-max bg-amber-200 px-5 py-2 text-pink-400 text-lg md:text-base font-medium rounded-full hover:scale-105 transition-all duration-300 cursor-pointer whitespace-nowrap"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            {/* suitable_for */}
            <div className="flex justify-center flex-col gap-4 mx-4 my-8">
              <div className="flex flex-row gap-6">
                  <label className="relative cursor-pointer flex flex-row gap-1 text-pink-500">
                  <input
                      type="checkbox"
                      checked={filters.vegan}
                      onChange={() => handleToggle('vegan')}
                      className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-amber-200 peer-checked:bg-green-800 rounded-full transition-all duration-300"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300"></div>
                  Vegan
                  </label>

                  <label className="relative cursor-pointer flex flex-row gap-1 text-pink-500">
                  <input
                      type="checkbox"
                      checked={filters.vegetarian}
                      onChange={() => handleToggle('vegetarian')}
                      className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-amber-200 peer-checked:bg-green-800 rounded-full transition-all duration-300"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300"></div>
                  Veg
                  </label>

                   <label className="relative cursor-pointer flex flex-row gap-1 text-pink-500">
                  <input
                      type="checkbox"
                      checked={filters.nonveg}
                      onChange={() => handleToggle('nonveg')}
                      className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-amber-200 peer-checked:bg-green-800 rounded-full transition-all duration-300"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300"></div>
                  Non-Veg
                  </label>

                  <label className="relative cursor-pointer flex flex-row gap-1 text-pink-500">
                  <input
                      type="checkbox"
                      checked={filters.glutenfree}
                      onChange={() => handleToggle('glutenfree')}
                      className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-amber-200 peer-checked:bg-green-800 rounded-full transition-all duration-300"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-300"></div>
                  Gluten-Free
                  </label>
              </div>
            </div>
     
          </motion.div>
         )}

          {/* Content Area */}          
            <div className="flex-1 overflow-y-auto  pb-10">
              {/* searched recipes */}
              {searchQuery && (
                <SearchedRecipe
                  title={searchQuery}
                  onClearSearch={handleClearSearch}
                  onViewRecipe={handleViewRecipe}
                  handleAddToFavorites={handleAddToFavorites}
                  favourites={favourites}
                />
                                    
              )}
             
              {/* suitablefor btns */}
                
              {selectedView === 'dashboard' && (
                <SuitableFor filters={filters} setFilters={setFilters} onViewRecipe={handleViewRecipe} handleAddToFavorites={handleAddToFavorites} favourites={favourites} />
              )}

              {/* selected cuisine */}
              {selectedView  === 'dashboard' &&  (
                <Cuisine selectedCuisine={selectedCuisine} onViewRecipe={handleViewRecipe} handleAddToFavorites={handleAddToFavorites} favourites={favourites} />

              )}
               
              {selectedView === 'dashboard' && (
                <ScrollCards onViewRecipe={handleViewRecipe} handleAddToFavorites={handleAddToFavorites} favourites={favourites} />
              )}
              {selectedView === 'favorites' && <Favorites onViewRecipe={handleViewRecipe} handleAddToFavorites={handleAddToFavorites} favourites={favourites} />}
              {selectedView === 'addrecipe' && <CreateRecipe />}
              {selectedView === 'viewRecipe' && (
                <ViewRecipe recipeId={selectedRecipeId} setSelectedView={setSelectedView} />
              )}
            
            </div>
     
      </div>
    </div>
  )
}

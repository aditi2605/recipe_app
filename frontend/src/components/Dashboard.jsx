'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardSideNav from './DashboardSideNav'
import Header from './Header'
import ScrollCards from './ScrollCards'
import Favorites from './Favorites'
import CreateRecipe from './CreateRecipe'
import ViewRecipe from './ViewRecipe'

export default function DashboardLayout() {
  const [selectedView, setSelectedView] = useState('dashboard')
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)

  const handleViewRecipe = (id) => {
    setSelectedRecipeId(id)
    setSelectedView('viewRecipe')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50 to-lime-100">
      {/* Sidebar */}
      <DashboardSideNav onSelect={setSelectedView} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <Header />

        {/*  Toast message */}
        <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="mx-auto mt-4 mb-6 bg-green-100 text-green-800 px-4 py-2 rounded-full shadow-md text-sm font-semibold flex items-center gap-2 w-fit"
        >
            🧑‍🍳  Welcome back,<span className="italic font-bold">Foodie!</span>! Let’s whip up something tasty today.
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-10">
          {selectedView === 'dashboard' && (
            <ScrollCards onViewRecipe={handleViewRecipe} />
          )}
          {selectedView === 'favorites' && <Favorites />}
          {selectedView === 'addrecipe' && <CreateRecipe />}
          {selectedView === 'viewRecipe' && (
            <ViewRecipe recipeId={selectedRecipeId} setSelectedView={setSelectedView} />
          )}
        </div>
      </div>
    </div>
  )
}

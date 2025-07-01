'use client'

import {  useState } from 'react'
import Input from './Input'


export default function CreateRecipe(){
    const [recipename, setRecipename] = useState('')
    const [cookingtime, setCookingtime] = useState('')
    const [cuisine, setCuisine] = useState('')
    const [serves, setServes] = useState('')
    const [suitablefor, setSuitablefor] = useState('')
    const [category, setCategory] = useState('')
    const [nutrition, setNutrition] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [instructions, setInstructions] = useState('')
    const [allergens, setAllergens] = useState('')
    const [tips, setTips] = useState('')
    const [cookingMethod, setCookingMethod] = useState('')
    const [difficulty, setDiffculty] = useState('')
    const [origin, setOrigin] = useState('')
    const [substitution, setSubstitution] = useState('')
    const [imageFile, setImageFile] = useState(null)

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0])
    }

    

    const handleSubmit = async(e) => {
        e.preventDefault()

        const formData = new FormData()
            formData.append('title', recipename)
            formData.append('origin', origin)
            formData.append('tips', tips)
            formData.append('difficulty', difficulty)
            formData.append('substitution', substitution)
            formData.append('cooking_method', cookingMethod)
            formData.append('instructions', instructions)
            formData.append('ingredients', ingredients)
            formData.append('cooking_time', cookingtime)
            formData.append('cuisine', cuisine)
            formData.append('serves', serves)
            formData.append('suitable_for', suitablefor)
            formData.append('category', category)
            formData.append('nutrition', nutrition)
            formData.append('allergens', allergens)
            formData.append('image', imageFile)
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`, {
            method: 'POST',
            body: formData,
            
            
            })

            const data = await response.json()
            console.log("Created:", data)
        } catch (err) {
            console.error("Failed to create recipe", err)
        }
    }


    return (
        <div className="w-fullmx-auto min-h-screen bg-gradient-to-r from-green-100 via-yellow-50 to-green-50 shadow-md p-6">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-8">🍳 Create Your Own Recipe</h2>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-black max-w-4xl mx-auto bg-white/10 backdrop-blur-xxl rounded-3xl shadow-2xl p-10 mt-12 border border-green-400" onSubmit={handleSubmit}>
                <Input label="Recipe Name" value={recipename} onChange={(e) => setRecipename(e.target.value)}/>
                <Input label="Cooking Time" value={cookingtime} onChange={(e) => setCookingtime(e.target.value)} />
                <Input label="Allergens" value={allergens} onChange={(e) => setAllergens(e.target.value)}/>
                <Input label="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
                <Input label="Serves" value={serves} onChange={(e) => setServes(e.target.value)} />
                <Input label="Suitable For" value={suitablefor} onChange={(e) => setSuitablefor(e.target.value)} />
                <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                <Input label="Nutrition" value={nutrition} onChange={(e) => setNutrition(e.target.value)} />
                <Input label="Ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                <Input label="Instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)}/>
                <Input label="Tips" value={tips} onChange={(e) => setTips(e.target.value)}/>
                <Input label="Cooking Method" value={cookingMethod} onChange={(e) => setCookingMethod(e.target.value)}/>
                <Input label="Substitution" value={substitution} onChange={(e) => setSubstitution(e.target.value)}/>
                <Input label="Difficulty" value={difficulty} onChange={(e) => setDiffculty(e.target.value)}/>
                <Input label="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)}/>
                
                {/* File input */}
                <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-900 border-orange-100 shadow-md border border-gray-300 rounded-lg cursor-pointer p-2"
                />
                </div>

                <div className="col-span-full text-center">
                <button
                    onClick={handleSubmit}
                    type="submit"
                    className="bg-gradient-to-r from-green-100 via-yellow-50 to-green-50 shadow-md text-green-600 h-14 w-48 text-lg font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 transition"
                >
                  Submit
                </button>
                </div>
            </form>
        </div>

      

    )
}
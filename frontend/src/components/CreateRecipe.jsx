'use client'

import { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import Input from './Input'

export default function CreateRecipe() {
  const [recipename, setRecipename] = useState('')
  const [cookingtime, setCookingtime] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [serves, setServes] = useState('')
  const [suitablefor, setSuitablefor] = useState('')
  const [category, setCategory] = useState('')
  const [calories, setCalories] = useState('')
  const [fat, setFat] = useState('')
  const [protine, setProtine] = useState('')
  const [sugar, setSugar] = useState('')
  const [carbs, setCarbs] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [instructions, setInstructions] = useState([])
  const [allergens, setAllergens] = useState('')
  const [tips, setTips] = useState([])
  const [cookingMethod, setCookingMethod] = useState('')
  const [difficulty, setDiffculty] = useState('')
  const [origin, setOrigin] = useState('')
  const [substitution, setSubstitution] = useState([])
  const [imageFile, setImageFile] = useState(null)

  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = value => {
    setOrigin(value.label) // store country name
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
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
    formData.append('calories', calories)
    formData.append('fat', fat)
    formData.append('sugar', sugar)
    formData.append('protine', protine)
    formData.append('carbs', carbs)
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
    <div className="w-full mx-auto min-h-screen bg-amber-50 shadow-md p-6">
      <h2 className="text-3xl font-bold text-center text-[#FF6B6B] mb-8">🍳 Create Your Own Recipe</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto rounded-3xl shadow-2xl p-10 mt-12 border border-[#FF6B6B]"
      >
        {/* Basic Info */}

          {/* recipe name */}
          <Input label="Recipe Name" value={recipename} onChange={(e) => setRecipename(e.target.value)} className='text-black' required/>
        
        {/* select cuisine from  */}
        {/* <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="block w-full p-2 border border-amber-200 shadow-md rounded text-black"
          required
        >
          <option value="">Select Cuisine</option>
          <option value="Italian">Italian</option>
          <option value="Indian">Indian</option>
          <option value="Mexican">Mexican</option>
          <option value="Chinese">Chinese</option>
          <option value="French">French</option>
        </select> */}

        {/* allergens */}
        <select
          value={allergens}
          onChange={(e) => setAllergens(e.target.value)}
          className="block w-full p-2 rounded border border-amber-200 shadow-md rounded text-black"
        >
          <option value="">Select Allergen</option>
          <option value="Soya">Soya</option>
          <option value="Nuts">Nuts</option>
          <option value="Dairy">Dairy</option>
          <option value="Gluten">Gluten</option>
          <option value="Fish">Fish</option>
        </select>
        
        {/* suitable_for */}
        <select
          value={suitablefor}
          onChange={(e) => setSuitablefor(e.target.value)}
          className="block w-full p-2 rounded border border-amber-200 shadow-md rounded text-black"
          required
        >
          <option value="">Suitable For</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="nonveg">Non-Vegetarian</option>
          <option value="glutenfree">Gluten-Free</option>
        </select>

        {/* Serves */}
        <div>
          <label className="block mb-1 text-black">Serves</label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setServes(prev => Math.max(parseInt(prev || 0) - 1, 0))} className="px-3 py-1 bg-[#FF6B6B] rounded text-white">-</button>
            <span className='text-black'>{serves || 0}</span>
            <button type="button" onClick={() => setServes(prev => parseInt(prev || 0) + 1)} className="px-3 py-1 bg-[#FF6B6B] rounded text-white">+</button>
          </div>
        </div>

        {/* Cooking Time */}
        <div>
          <label className="block mb-1 text-black">Cooking Time (minutes)</label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setCookingtime(prev => Math.max(parseInt(prev || 0) - 1, 0))} className="px-3 py-1 bg-[#FF6B6B] rounded text-white">-</button>
            <span className='text-black'>{cookingtime || 0}</span>
            <button type="button" onClick={() => setCookingtime(prev => parseInt(prev || 0) + 1)} className="px-3 py-1 bg-[#FF6B6B] rounded text-white">+</button>
          </div>
        </div>

        {/* Difficulty */}
        <select
          value={difficulty}
          onChange={(e) => setDiffculty(e.target.value)}
          className="block w-full p-2 border border-amber-200 rounded shadow-md text-black"
          required
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Origin */}
        <div className="col-span-full">
          <label className="block mb-1 text-black">Origin</label>
          <div className='border border-amber-200 shadow-md rounded text-black'>
            <Select options={options} onChange={changeHandler} />
          </div>
          
        </div>

        {/* Nutrition */}
        <div className="col-span-full">
          <label className="block mb-1 text-black">Nutrition</label>
          <div className="grid grid-cols-2 gap-2 text-black ">
            
            <input
                type='number'
                value={calories}
                placeholder='calories'
                onChange={(e) => setCalories(e.target.value)}
                className="p-2 border border-amber-200 shadow-md rounded text-black"
                required
              />
              <input
                type='number'
                value={fat}
                placeholder='fat'
                onChange={(e) => setFat(e.target.value)}
                className="p-2 border border-amber-200 shadow-md rounded text-black"
                required
              />
              <input
                type='number'
                value={sugar}
                placeholder='sugar'
                onChange={(e) => setSugar(e.target.value)}
                className="p-2 border border-amber-200 shadow-md rounded text-black"
                required
              />
              <input
                type='number'
                value={carbs}
                placeholder='carbs'
                onChange={(e) => setCarbs(e.target.value)}
                className="p-2 border border-amber-200 shadow-md rounded text-black"
                required
              />
              <input
                type='number'
                value={protine}
                placeholder='protine'
                onChange={(e) => setProtine(e.target.value)}
                className="p-2 border border-amber-200 shadow-md rounded text-black"
                required
              />
            </div>
          {/* <div className="grid grid-cols-2 gap-2 text-black ">
            {['calories', 'fat', 'sugar', 'carbs', 'protein'].map(key => (
              <input
                key={key}
                type="number"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={nutrition[key]}
                onChange={(e) => setNutrition({ ...nutrition, [key]: e.target.value })}
                className="p-2 border border-amber-200 shadow-md rounded text-black"
              />
            ))}
          </div> */}
        </div>

        {/* Ingredients */}
        <div className="col-span-full">
          <label className="block mb-1 text-black">Ingredients</label>
          {ingredients.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...ingredients]
                  updated[index] = e.target.value
                  setIngredients(updated)
                }}
                className="flex-1 p-2 border rounded text-black"
                required
              />
              <button type="button" onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))} className="px-2 py-1 bg-red rounded">❌</button>
            </div>
          ))}
          <button type="button" onClick={() => setIngredients([...ingredients, ''])} className="px-4 py-2 bg-[#FF6B6B] text-white rounded">➕ Add Ingredient</button>
        </div>

        {/* Instructions */}
        <div className="col-span-full">
          <label className="block mb-1 text-black">Instructions</label>
          {instructions.map((step, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={step}
                onChange={(e) => {
                  const updated = [...instructions]
                  updated[index] = e.target.value
                  setInstructions(updated)
                }}
                className="flex-1 p-2 border rounded text-black"
                required
              />
              <button type="button" onClick={() => setInstructions(instructions.filter((_, i) => i !== index))} className="px-2 py-1 bg-red-200 rounded">❌</button>
            </div>
          ))}
          <button type="button" onClick={() => setInstructions([...instructions, ''])} className="px-4 py-2 bg-[#FF6B6B] rounded text-white">➕ Add Step</button>
        </div>

        {/* Tips */}
        <div className="col-span-full">
          <label className="block mb-1 text-black">Tips</label>
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={tip}
                onChange={(e) => {
                  const updated = [...tips]
                  updated[index] = e.target.value
                  setTips(updated)
                }}
                className="flex-1 p-2 border rounded text-black"
                required
              />
              <button type="button" onClick={() => setTips(tips.filter((_, i) => i !== index))} className="px-2 py-1 bg-red-200 rounded">❌</button>
            </div>
          ))}
          <button type="button" onClick={() => setTips([...tips, ''])} className="px-4 py-2 bg-[#FF6B6B] rounded text-white">➕ Add Tip</button>
        </div>

        {/* Substitution */}
        <div className="col-span-full">
          <label className="block mb-1 text-black">Substitution</label>
          {substitution.map((sub, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={sub}
                onChange={(e) => {
                  const updated = [...substitution]
                  updated[index] = e.target.value
                  setSubstitution(updated)
                }}
                className="flex-1 p-2 border rounded text-black"
                required
              />
              <button type="button" onClick={() => setSubstitution(substitution.filter((_, i) => i !== index))} className="px-2 py-1 bg-red-200 rounded">❌</button>
            </div>
          ))}
          <button type="button" onClick={() => setSubstitution([...substitution, ''])} className="px-4 py-2 bg-[#FF6B6B] rounded text-white">➕ Add Substitute</button>
        </div>

        {/* Image Upload */}
        <div className="col-span-full">
          <label className="block mb-1 text-black">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full p-2 border border-amber-200 shadow-md rounded text-black"
            required
          />
        </div>

        {/* Submit */}
        <div className="col-span-full text-center">
          <button
            type="submit"
            className="bg-[#FF6B6B] text-white px-6 py-3 rounded-full hover:bg-green-700"
          >
            Submit Recipe
          </button>
        </div>
      </form>
    </div>
  )
}

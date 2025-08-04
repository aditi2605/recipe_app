'use client'

import { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useRouter } from 'next/navigation'

export default function CreateRecipe( {setSelectedView }) {

  const router = useRouter()

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
  const [tags, setTags] = useState('')

  const options = useMemo(() => countryList().getData(), [])

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '0.75rem',
      borderColor: '#FBBF24', // amber-200
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '2px',
      fontSize: '0.9rem',
    }),
  };

   const handleRedirect = () => {
        setSelectedView('dashboard')
    }

  const changeHandler = value => {
    setOrigin(value.label) // store country names
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
    // formData.append('cuisine', cuisine)
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
    formData.append('tag', tags)

    try {

      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`, {
        method: 'POST',
        headers: { 'Authorization' : `Bearer ${token}`},
        body: formData,
      })

      const data = await response.json()
      console.log("Created:", data)
      router.push('/Dashboard')
      alert('Recipe has been created successfully 🎉')
    } catch (err) {
      console.error("Failed to create recipe", err)
    }
  }

  return (
    <div className="w-full min-h-screen bg-amber-50 shadow-md px-4 py-6 overflow-x-hidden">
      <h2 className="text-3xl font-bold text-center text-[#FF6B6B] mb-8">🍳 Create Your Own Recipe</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 bg-white rounded-2xl shadow-2xl p-6 sm:p-10 mt-6 border border-[#FF6B6B]"
      >
        {/* --- Basic Info --- */}
        <h3 className="col-span-1 sm:col-span-2 text-xl font-semibold text-[#FF6B6B]">Basic Info</h3>

        <input placeholder="Recipe Name" value={recipename} onChange={(e) => setRecipename(e.target.value)} className="w-full border border-amber-300 p-2 shadow-md rounded-xl text-black" required />

        <select value={allergens} onChange={(e) => setAllergens(e.target.value)} className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black">
          <option value="">Select Allergen</option>
          <option value="Soya">Soya</option>
          <option value="Nuts">Nuts</option>
          <option value="Dairy">Dairy</option>
          <option value="Gluten">Gluten</option>
          <option value="Fish">Fish</option>
          <option value="None">None</option>
        </select>

        <select value={suitablefor} onChange={(e) => setSuitablefor(e.target.value)} className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black" required>
          <option value="">Suitable For</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="nonveg">Non-Vegetarian</option>
          <option value="glutenfree">Gluten-Free</option>
          <option value="glutenfree">All</option>
        </select>

        <select value={difficulty} onChange={(e) => setDiffculty(e.target.value)} className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black" required>
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <div className="sm:col-span-2 w-full">
          <label className="block mb-1 text-black">Country Origin</label>
          <div className="border border-amber-200 shadow-md rounded-xl text-black">
            <Select options={options} onChange={changeHandler} styles={customStyles} className="w-full" />
          </div>
        </div>

        {/* --- Nutrition Info --- */}
        <h3 className="col-span-1 sm:col-span-2 text-xl font-semibold text-[#FF6B6B] mt-4">Nutrition Info</h3>
        {[['Calories', calories, setCalories], ['Fat', fat, setFat], ['Sugar', sugar, setSugar], ['Carbs', carbs, setCarbs], ['Protein', protine, setProtine]].map(([label, value, setter]) => (
          <input key={label} type="number" value={value} placeholder={label} onChange={(e) => setter(e.target.value)} className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black" required />
        ))}

        {/* --- Tag --- */}
        <select value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black">
          <option value="">Select Tag</option>
          <option value="classic">Classic</option>
          <option value="trending">Trending</option>
          <option value="healthy">Healthy</option>
          <option value="Recommended">Recommended</option>
          <option value="streetfood">Streetfood</option>
          <option value="chef-choice">Chef-Choice</option>
          <option value="popular">Popular</option>
        </select>

        {/* --- Serves --- */}
        <div className="flex flex-col w-full">
          <label className="text-black mb-1">Serves</label>
          <div className="flex justify-start gap-2 items-center w-full">
            <button type="button" onClick={() => setServes(prev => Math.max(parseInt(prev || 0) - 1, 0))} className="px-3 py-1 bg-[#FF6B6B] text-white rounded">-</button>
            <input type="number" value={serves} readOnly className="w-16 text-center border border-amber-200 p-2 rounded-xl text-black" />
            <button type="button" onClick={() => setServes(prev => parseInt(prev || 0) + 1)} className="px-3 py-1 bg-[#FF6B6B] text-white rounded">+</button>
          </div>
        </div>

        {/* --- Cooking Time --- */}
        <div className="flex flex-col w-full">
          <label className="text-black mb-1">Cooking Time (minutes)</label>
          <div className="flex justify-start gap-2 items-center w-full">
            <button type="button" onClick={() => setCookingtime(prev => Math.max(parseInt(prev || 0) - 1, 0))} className="px-3 py-1 bg-[#FF6B6B] text-white rounded">-</button>
            <input type="number" value={cookingtime} min="0" onChange={e => { const value = parseInt(e.target.value); setCookingtime(isNaN(value) || value < 0 ? 0 : value); }} className="w-16 text-center border border-amber-200 p-2 rounded-xl text-black" />
            <button type="button" onClick={() => setCookingtime(prev => parseInt(prev || 0) + 1)} className="px-3 py-1 bg-[#FF6B6B] text-white rounded">+</button>
          </div>
        </div>

        {/* --- Ingredients --- */}
        <h3 className="col-span-1 sm:col-span-2 text-xl font-semibold text-[#FF6B6B] mt-4">Ingredients</h3>
        <div className="col-span-1 sm:col-span-2 space-y-2">
          {ingredients.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input type="text" value={item} onChange={(e) => { const updated = [...ingredients]; updated[index] = e.target.value; setIngredients(updated); }} className="flex-1 p-2 border rounded-xl text-black" />
              <button type="button" onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))} className="bg-red-400 px-2 py-1 rounded-xl">❌</button>
            </div>
          ))}
          <button type="button" onClick={() => setIngredients([...ingredients, ''])} className="px-4 py-2 bg-[#FF6B6B] text-white rounded-xl">➕ Add Ingredient</button>
        </div>

        {/* --- Instructions --- */}
        <h3 className="col-span-1 sm:col-span-2 text-xl font-semibold text-[#FF6B6B] mt-4">Instructions</h3>
        <div className="col-span-1 sm:col-span-2 space-y-2">
          {instructions.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input type="text" value={item} onChange={(e) => { const updated = [...instructions]; updated[index] = e.target.value; setInstructions(updated); }} className="flex-1 p-2 border rounded-xl text-black" />
              <button type="button" onClick={() => setInstructions(instructions.filter((_, i) => i !== index))} className="bg-red-400 px-2 py-1 rounded">❌</button>
            </div>
          ))}
          <button type="button" onClick={() => setInstructions([...instructions, ''])} className="px-4 py-2 bg-[#FF6B6B] text-white rounded-xl">➕ Add Instruction</button>
        </div>

        {/* --- Tips --- */}
        <h3 className="col-span-1 sm:col-span-2 text-xl font-semibold text-[#FF6B6B] mt-4">Add Tips</h3>
        <div className="col-span-1 sm:col-span-2 space-y-2">
          {tips.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input type="text" value={item} onChange={(e) => { const updated = [...tips]; updated[index] = e.target.value; setTips(updated); }} className="flex-1 p-2 border rounded-xl text-black" />
              <button type="button" onClick={() => setTips(tips.filter((_, i) => i !== index))} className="bg-red-400 px-2 py-1 rounded">❌</button>
            </div>
          ))}
          <button type="button" onClick={() => setTips([...tips, ''])} className="px-4 py-2 bg-[#FF6B6B] text-white rounded-xl">➕ Add Tips</button>
        </div>

        {/* --- Substitutions --- */}
        <h3 className="col-span-1 sm:col-span-2 text-xl font-semibold text-[#FF6B6B] mt-4">Add Substitutions</h3>
        <div className="col-span-1 sm:col-span-2 space-y-2">
          {substitution.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input type="text" value={item} onChange={(e) => { const updated = [...substitution]; updated[index] = e.target.value; setSubstitution(updated); }} className="flex-1 p-2 border rounded-xl text-black" />
              <button type="button" onClick={() => setSubstitution(substitution.filter((_, i) => i !== index))} className="bg-red-400 px-2 py-1 rounded">❌</button>
            </div>
          ))}
          <button type="button" onClick={() => setSubstitution([...substitution, ''])} className="px-4 py-2 bg-[#FF6B6B] text-white rounded-xl">➕ Add Substitution</button>
        </div>

        {/* --- Image Upload --- */}
        <div className="col-span-1 sm:col-span-2">
          <label className="block mb-1 text-black">Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black" required />
        </div>

        {/* --- Submit Button --- */}
        <div className="col-span-1 sm:col-span-2 text-center mt-6">
          <button type="submit" onClick={handleRedirect} className="bg-[#FF6B6B] text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300">
            Submit Recipe
          </button>
        </div>
      </form>
    </div>
  )
}

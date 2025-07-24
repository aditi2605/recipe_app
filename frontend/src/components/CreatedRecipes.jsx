'use client'

import {useState, useEffect , useMemo} from 'react'
import Image from 'next/image';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {  Heart, Trash, Pencil } from 'lucide-react'

export default function CreatedRecipes({ onViewRecipe, favourites, handleAddToFavorites, onSelect }){

    const router = useRouter()
    const [myRecipes, setMyRecipes] = useState([])
    const [recipeToEdit, setRecipeToEdit] = useState(null)
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
    const [tag, setTag] = useState('')

    const options = useMemo(() => countryList().getData(), [])

    const changeHandler = value => {
      setOrigin(value.label) // store country names
    } 

    const handleImageChange = (e) => {
      setImageFile(e.target.files[0])
    }


    useEffect(() => {
        const fetchMyCreatedRecipes = async() => {
            try{
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/myrecipes`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                )
                const data = await response.json()
                console.log(response)
                setMyRecipes(data)
                
            } catch(err){
                console.error("Failed to fetch recipes created by you", err)
            }
        }
        fetchMyCreatedRecipes()
    }, [])

    // update myrecipe
   const UpdateMyRecipe = async (recipeId, updatedData) => {
  try {
    let imageFilename = updatedData.image;

    // If a new image is uploaded, upload it first
    if (updatedData.image instanceof File) {
      const formDataImage = new FormData();
      formDataImage.append("file", updatedData.image);

      const imageUploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-image`, {
        method: "POST",
        body: formDataImage,
      });

      if (!imageUploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const imageData = await imageUploadResponse.json();
      imageFilename = imageData.filename; // e.g., 'burger.jpg'
    }

    // Build plain JSON object for PUT request
    const updateBody = {
      title: updatedData.title,
      allergens: updatedData.allergens,
      suitable_for: updatedData.suitable_for,
      cooking_time: updatedData.cooking_time,
      origin: updatedData.origin,
      difficulty: updatedData.difficulty,
      calories: updatedData.calories,
      fat: updatedData.fat,
      sugar: updatedData.sugar,
      carbs: updatedData.carbs,
      protine: updatedData.protine,
      tag: updatedData.tag,
      serves: updatedData.serves,
      ingredients: updatedData.ingredients.join(", "),
      instructions: updatedData.instructions.join("\n"),
      tips: updatedData.tips.join("\n"),
      substitution: updatedData.substitution.join(", "),
      image: imageFilename, 
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/myrecipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updateBody),
    });

    if (response.ok) {
      setMyRecipes(prev => prev.filter(r => r.id !== recipeId));
    } else {
      const errData = await response.json();
      console.error("Failed to update recipe:", errData);
    }
  } catch (err) {
    console.error("Error updating recipe", err);
  }
};


    //  delete my recipe
    const removeMyRecipe = async (recipeId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/myrecipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        setMyRecipes(prev => prev.filter(r => r.id !== recipeId))
      } else {
        console.error("Failed to remove from my created recipe")
      }
    } catch (err) {
      console.error("Error removing my created recipe", err)
    }
  }

    return (
        <div className="w-full px-4 md:px-10 py-12 space-y-16">
            <section>
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                    <div className="flex space-x-4">
                        {!recipeToEdit && Array.isArray(myRecipes) && myRecipes.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ scal : 1.03 }}
                                className='min-w-[280px] md:min-w-[320px] bg-white/80 backdrop-blur-lg border border-amber-300 rounded-3xl transition-transform duration-300 relative overflow-hidden group'
                            >
                                {/* Recipe Image */}
                                <div className="relative w-full h-56 sm:h-64">
                                    <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`}
                                    // src={`http://localhost:8000/uploads/${item.image}`}
                                    alt={item.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-t-3xl group-hover:scale-105 transition-transform duration-300"
                                    />

                                     {/* recipeby tag */}
                                    {item.username && (
                                        <div className="absolute bottom-3 right-3 bg-white/30 backdrop-blur-sm border border-[#FF6B6B] rounded-lg text-[#FF6B6B] text-md font-extrabold px-4 py-2 shadow-lg">
                                            RecipeBy : {item.username}
                                        </div>
                                    )}

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
                                        <span className="inline-block text-sm bg-red-100 text-[#FF6B6B] px-4 py-2 rounded-full mt-1">
                                        🍽 {item.origin}
                                        </span>

                                        {/* SuitableFor */}
                                        <span className="inline-block text-sm bg-red-100 text-[#FF6B6B] px-4 py-2 rounded-full mt-1">
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
                                        <div className='space-x-4'>
                                          <motion.button
                                              whileTap={{ scale: 0.9 }}
                                              className="text-red-600 hover:text-pink-600"
                                              onClick={() => handleAddToFavorites(item.id)}
                                          >
                                              <Heart className={`w-5 h-5 ${favourites.includes(item.id) ? 'fill-red-600' : ''}`} />
                                          </motion.button>

                                          {/* delete btn  */}
                                          <button onClick={() => removeMyRecipe(item.id)}>
                                              <Trash className='w-5 h-5 text-red-600 hover:text-red-700' />
                                          </button>

                                          {/* edit btn */}
                                          <button onClick={() => {
                                            setRecipeToEdit(item.id);
                                            setRecipename(item.title);
                                            setAllergens(item.allergens)
                                            setSuitablefor(item.suitable_for)
                                            setDiffculty(item.difficulty)
                                            setOrigin(item.origin)
                                            setCalories(item.calories)
                                            setFat(item.fat)
                                            setSugar(item.sugar)
                                            setCarbs(item.carbs)
                                            setProtine(item.protine)
                                            setTag(item.tag)
                                            setServes(item.serves)
                                            setCookingtime(item.cooking_time)
                                            setImageFile(item.imageFile)
                                            setIngredients(Array.isArray(item.ingredients) ? item.ingredients : item.ingredients?.split(",").map(s => s.trim()) || []);
                                            setInstructions(Array.isArray(item.instructions) ? item.instructions : item.instructions?.split("\n").map(s => s.trim()) || []);
                                            setTips(Array.isArray(item.tips) ? item.tips : item.tips?.split("\n").map(s => s.trim()) || []);
                                            setSubstitution(Array.isArray(item.substitution) ? item.substitution : item.substitution?.split(",").map(s => s.trim()) || []);
                                            }}>
                                              <Pencil className='w-5 h-5 text-red-600 hover:text-red-700' />
                                          </button>
                                        </div>

                                    </div>
                                </div>

                            </motion.div>

                        ))}

                        {/* edit the recipe */}
                        {recipeToEdit && (
                          <div className='w-full'>
                            <h2 className="text-3xl font-bold text-center text-[#FF6B6B] mb-8">Edit Your Recipe</h2>

                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();

                                await UpdateMyRecipe(recipeToEdit, {
                                  title: recipename,
                                  allergens,
                                  suitablefor,
                                  cooking_time: Number(cookingtime),
                                  origin,
                                  difficulty,
                                  calories: Number(calories),
                                  fat: Number(fat),
                                  sugar: Number(sugar),
                                  carbs: Number(carbs),
                                  protine: Number(protine),
                                  ingredients,
                                  instructions,
                                  tips,
                                  tag,
                                  substitution,
                                  serves: Number(serves),
                                  image: imageFile, 
                                });

                                setRecipeToEdit(null);
                                
                              }}

                              className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 bg-white rounded-3xl shadow-lg p-10 mt-12 border border-[#FF6B6B]"
                            >
                              {/* Basic Info */}
                              <h3 className="col-span-2 text-xl font-semibold text-[#FF6B6B]">Basic Info</h3>
                              
                              <input  placeholder='Recipe Name' value={recipename} onChange={(e) => setRecipename(e.target.value)} className="text-black border border-amber-300 p-2 shadow-md rounded-xl" required />
                              
                          

                              {/* <select
                                value={cuisine}
                                onChange={(e) => setCuisine(e.target.value)}
                                className="w-full p-2 border border-amber-200 shadow-md rounded text-black"
                                required
                              >
                                <option value="">Select Cuisine</option>
                                <option value="Italian">Italian</option>
                                <option value="Indian">Indian</option>
                                <option value="Mexican">Mexican</option>
                                <option value="Chinese">Chinese</option>
                                <option value="French">French</option>
                              </select> */}

                              <select
                                value={allergens}
                                onChange={(e) => setAllergens(e.target.value)}
                                className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black"
                              >
                                <option value="">Select Allergen</option>
                                <option value="Soya">Soya</option>
                                <option value="Nuts">Nuts</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Gluten">Gluten</option>
                                <option value="Fish">Fish</option>
                                <option value="None">None</option>
                              </select>

                              <select
                                value={suitablefor}
                                onChange={(e) => setSuitablefor(e.target.value)}
                                className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black"
                                required
                              >
                                <option value="">Suitable For</option>
                                <option value="vegan">Vegan</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="nonveg">Non-Vegetarian</option>
                                <option value="glutenfree">Gluten-Free</option>
                                <option value="glutenfree">All</option>
                              </select>

                              {/* cooking difficulty level */}
                              <select
                                value={difficulty}
                                onChange={(e) => setDiffculty(e.target.value)}
                                className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black"
                                required
                              >
                                <option value="">Select Difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                              </select>



                              {/* Country Origin */}
                              <div className="sm:col-span-2">
                                <label className="block mb-1 text-black">Country Origin</label>
                                <div className="border border-amber-200 shadow-md rounded-xl text-black">
                                  <Select options={options} onChange={changeHandler} />
                                </div>
                              </div>

                              {/*  Nutrition */}
                              <h3 className="col-span-2 text-xl font-semibold text-[#FF6B6B] mt-4">Nutrition Info</h3>
                              {[['Calories', calories, setCalories], ['Fat', fat, setFat], ['Sugar', sugar, setSugar], ['Carbs', carbs, setCarbs], ['Protein', protine, setProtine]].map(([label, value, setter]) => (
                                <input
                                  key={label}
                                  type="number"
                                  value={value}
                                  placeholder={label}
                                  onChange={(e) => setter(e.target.value)}
                                  className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black"
                                  required
                                />
                              ))}

                              {/* tag */}
                              <select
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black"
                              >
                                <option value="">Select Tag</option>
                                <option value="classic">Classic</option>
                                <option value="trending">Trending</option>
                                <option value="healthy">Healthy</option>
                                <option value="Recommended">Recommended</option>
                                <option value="streetfood">Streetfood</option>
                                <option value="chef-choice">Chef-Choice</option>
                                <option value="popular">Popular</option>
                              </select>

                              {/* Serves */}
                              <div className="flex flex-col">
                                <label className="text-black mb-1">Serves</label>
                                <div className="flex gap-2 items-center">
                                  <button type="button" onClick={() => setServes(prev => Math.max(parseInt(prev || 0) - 1, 0))} className="px-3 py-1 bg-[#FF6B6B] text-white rounded">-</button>
                                  <input type="number" value={serves} readOnly className="w-16 text-center border border-amber-200 p-2 rounded-xl text-black" />
                                  <button type="button" onClick={() => setServes(prev => parseInt(prev || 0) + 1)} className="px-3 py-1 bg-[#FF6B6B] text-white rounded">+</button>
                                </div>
                              </div>

                              {/* Cooking Time */}
                              <div className="flex flex-col">
                                <label className="text-black mb-1">Cooking Time (minutes)</label>
                                <div className="flex gap-2 items-center">
                                  <button type="button" onClick={() => setCookingtime(prev => Math.max(parseInt(prev || 0) - 1, 0))} className="px-3 py-1 bg-[#FF6B6B] text-white rounded">-</button>
                                  <input type="number" value={cookingtime} min="0" onChange={e => {const value = parseInt(e.target.value); if (isNaN(value) || value< 0) { setCookingtime(0)} else { setCookingtime(value)}}} className="w-16 text-center border border-amber-200 p-2 rounded-xl text-black" />
                                  <button type="button" onClick={() => setCookingtime(prev => parseInt(prev || 0) + 1)} className="px-3 py-1 bg-[#FF6B6B] text-white rounded">+</button>
                                </div>
                              </div>


                              {/* ingredients */}
                              <h3 className="col-span-2 text-xl font-semibold text-[#FF6B6B] mt-4">Ingredients</h3>
                              <div className="col-span-2 space-y-2">
                                {Array.isArray(ingredients) && ingredients.map((item, index) => (
                                  <div key={index} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) => {
                                        const updated = [...ingredients];
                                        updated[index] = e.target.value;
                                        setIngredients(updated);
                                      }}
                                      className="flex-1 p-2 border rounded-xl text-black"
                                    />
                                    <button type="button" onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))} className="bg-red-400 px-2 py-1 rounded-xl">❌</button>
                                  </div>
                                ))}
                                <button type="button" onClick={() => setIngredients([...ingredients, ''])} className="px-4 py-2 bg-[#FF6B6B] text-white rounded-xl">➕ Add Ingredient</button>
                              </div>

                              {/* instructions */}
                              <h3 className="col-span-2 text-xl font-semibold text-[#FF6B6B] mt-4">Instructions</h3>
                              <div className="col-span-2 space-y-2">
                                {Array.isArray(instructions) && instructions.map((item, index) => (
                                  <div key={index} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) => {
                                        const updated = [...instructions];
                                        updated[index] = e.target.value;
                                        setInstructions(updated);
                                      }}
                                      className="flex-1 p-2 border rounded-xl text-black"
                                    />
                                    <button type="button" onClick={() => setInstructions(instructions.filter((_, i) => i !== index))} className="bg-red-400 px-2 py-1 rounded">❌</button>
                                  </div>
                                ))}
                                <button type="button" onClick={() => setInstructions([...instructions, ''])} className="px-4 py-2 bg-[#FF6B6B] text-white rounded-xl">➕ Add Instruction</button>
                              </div>

                              {/* Tips */}
                              <h3 className="col-span-2 text-xl font-semibold text-[#FF6B6B] mt-4">Add Tips</h3>
                              <div className="col-span-2 space-y-2">
                                {Array.isArray(tips) && tips.map((item, index) => (
                                  <div key={index} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) => {
                                        const updated = [...tips];
                                        updated[index] = e.target.value;
                                        setTips(updated);
                                      }}
                                      className="flex-1 p-2 border rounded-xl text-black"
                                    />
                                    <button type="button" onClick={() => setTips(tips.filter((_, i) => i !== index))} className="bg-red-400 px-2 py-1 rounded">❌</button>
                                  </div>
                                ))}
                                <button type="button" onClick={() => setTips([...tips, ''])} className="px-4 py-2 bg-[#FF6B6B] text-white rounded-xl">➕ Add Tips</button>
                              </div>

                              {/* substitution */}
                              <h3 className="col-span-2 text-xl font-semibold text-[#FF6B6B] mt-4">Add Substitutions</h3>
                              <div className="col-span-2 space-y-2">
                                {Array.isArray(substitution) && substitution.map((item, index) => (
                                  <div key={index} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) => {
                                        const updated = [...substitution];
                                        updated[index] = e.target.value;
                                        setSubstitution(updated);
                                      }}
                                      className="flex-1 p-2 border rounded-xl text-black"
                                    />
                                    <button type="button" onClick={() => setSubstitution(substitution.filter((_, i) => i !== index))} className="bg-red-400 px-2 py-1 rounded">❌</button>
                                  </div>
                                ))}
                                <button type="button" onClick={() => setSubstitution([...substitution, ''])} className="px-4 py-2 bg-[#FF6B6B] text-white rounded-xl">➕ Add Substitutions</button>
                              </div>
                              

                              {/* Image Upload */}
                              <div className="col-span-2">
                                <label className="block mb-1 text-black">Image</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="w-full p-2 border border-amber-200 shadow-md rounded-xl text-black"
                                  required
                                />
                              </div>

                              {/* Submit btn */}
                              <div className="col-span-2 text-center mt-6">
                                <button
                                  type="submit"
                                  className="bg-[#FF6B6B] text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300"
                                >
                                  Submit Recipe
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
        
    )
}
'use client'
import { use } from 'react';
import ViewRecipe from "@/components/ViewRecipe.jsx";


export default function page( { params }){

  const { id } = use(params)

  return (
    <ViewRecipe id={id} />
  )
}
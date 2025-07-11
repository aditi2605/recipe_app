'use client'

import { motion } from 'framer-motion'


export default function ConnectPeople() {
    const floatingEmojis = [
        { emoji: '👨🏼‍🦰', message: "¡Se ve delicioso!", className: 'top-[2%] left-[2%]'},      
        { emoji: '👱🏽‍♀️', message: "Looks yummy!", className: 'bottom-[2%] right-[2%] hidden sm:block' },  
        { emoji: '🧑🏼‍🦲', message: "C'est appétissant !", className: 'bottom-[2%] left-[2%]' },     
        { emoji: '🧑🏻‍🍳', message: "Delizioso!", className: 'top-[2%] right-[2%] hidden sm:block' },               
        { emoji: '👨🏻‍🍳', message: "bon appétit", className: 'bottom-[8%] left-[50%]' }, 
        { emoji: '💁🏻‍♀️', message: "बहुत स्वादिष्ट!", className: 'top-[8%] left-[50%]' },
    ];

    return (
         <section className="relative w-full flex items-center justify-center overflow-hidden p-12">
            {/* Floating Emojis */}
            {floatingEmojis.map((item, idx) => (
                <motion.div
                    key={idx}
                    className={`absolute overflow-hidden flex  items-center space-x-3 ${item.className}`}
                    animate={{ y: [0, -10, 10, 0], x: [0, 5, -5, 0] }}
                    transition={{ duration: 8 + idx, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <span className="text-3xl sm:text-4xl md:text-5xl">{item.emoji}</span>
                    <div className="bg-green-100 text-black px-4 py-2 rounded-xl text-base sm:text-lg shadow-md">
                    {item.message}
                    <span className="ml-2 text-gray-500 text-sm">11:59</span>
                    </div>
                </motion.div>
            ))}

            {/* Center Text + Chat Bubble */}
            <div className="relative z-10 text-center max-w-3xl space-y-6 m-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 leading-relaxed">
                    A global kitchen for every foodie. Discover, share, and celebrate recipes from every corner of the world — all in one delicious place.
                </h2>

            </div>
  
        </section>
        
    )
}
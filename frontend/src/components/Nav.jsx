'use client'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import Logo from '../../public/images/bite_cult_logo.png'
import { LogIn, User, Users, Images, SquarePen } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Nav({ trigger }) {
  const [modal, setModal] = useState(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (trigger === 'login') setModal('login')
    if (trigger === 'signup') setModal('signup')
  }, [trigger])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new URLSearchParams()
    formData.append('username', email.trim())
    formData.append('password', password.trim())

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.access_token)
        setTimeout(() => {
          window.location.href = '/Dashboard'
        }, 2000)
      } else {
        alert(data.detail || 'Login Failed')
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong during login.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signin`, {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()
      if (response.ok) {
        alert('Signup successful. Please login.')
        setModal('login')
      } else {
        alert(data.detail || 'Signup failed')
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong during signup.')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setModal(null)
    setUsername('')
    setEmail('')
    setPassword('')
  }

  const buttons = [
    { label: 'Login', icon: LogIn, action: () => setModal('login') },
    { label: 'About', icon: User, action: () => router.push('#about') },
    { label: 'Community', icon: Users, action: () => router.push('#joinCommunity') },
    { label: 'Gallery', icon: Images, action: () => router.push('#gallery') },
    { label: 'Blogs', icon: SquarePen, action: () => alert('Coming soon!') },
  ]

  return (
    <>
      {scrolled && (
        <div className='fixed bottom-4 right-8 z-40 flex flex-col gap-4 bg-white/80 backdrop-blur-md px-4 py-4 rounded-full shadow-lg'>
          {buttons.map((btn, index) => (
            <button
              key={index}
              onClick={btn.action}
              className='text-2xl hover:scale-110 transition'
              title={btn.label}
            >
              <btn.icon className='text-[#FF6B6B] font-black hover:text-pink-400' />
            </button>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[#F7FFF7] w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#FF6B6B] text-2xl font-bold hover:scale-110 transition"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-6 text-[#FF6B6B]">
              {modal === 'login' ? 'Login' : 'Create Account'}
            </h2>

            {modal === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FF9F1C] rounded-lg text-black"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FF9F1C] rounded-lg text-black"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#FF6B6B] text-white font-bold rounded-lg hover:bg-[#FF9F1C]"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FF9F1C] rounded-lg text-black"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FF9F1C] rounded-lg text-black"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FF9F1C] rounded-lg text-black"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#FF6B6B] text-white font-bold rounded-lg hover:bg-[#FF9F1C]"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </form>
            )}

            <div className="mt-4 text-center">
              {modal === 'login' ? (
                <p className="text-sm text-[#333]">
                  Don&apos;t have an account?{' '}
                  <span
                    onClick={() => setModal('signup')}
                    className="text-[#FF6B6B] font-semibold cursor-pointer hover:underline"
                  >
                    Create one
                  </span>
                </p>
              ) : (
                <p className="text-sm text-[#333]">
                  Already have an account?{' '}
                  <span
                    onClick={() => setModal('login')}
                    className="text-[#FF6B6B] font-semibold cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FF6B6B]" />
        </div>
      )}
    </>
  )
}

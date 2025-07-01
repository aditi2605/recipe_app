'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Logo from '../../public/images/logo_3.jpg'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Nav( { trigger }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [modal, setModal] = useState(null) 
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setLogin] = useState(false)
  const [isSignup, setSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [iconIndex, setIconIndex] = useState(0)

  const router = useRouter()
  const icons = ['🍕', '🍔', '🧁', '🥗', '🌮', '🍰', '🥪' ]
  const toggleModal = (type) => setModal(type)
  const closeModal = () => setModal(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = new URLSearchParams()
    formData.append('username', email.trim())
    formData.append('password', password.trim())

    try{

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.access_token)
        setTimeout(() => {
          window.location.href = '/Dashboard';
        }, 3000)
      } else {
        alert(data.detail?.[0]?.msg || 'Login Failed')
      }
    }catch(error){
      alert('Something went wrong!')
    }finally {
      setLoading(false)
    }
  }


  const handleSignup = async (e) => {
    e.preventDefault()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signin`, {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await response.json()
    if (response.ok) {
      alert('Account Created Successfully! Please Login.')
      setModal('login')
    } else {
      alert(data.detail?.[0]?.msg || 'Signup Failed')
    }
  }

  useEffect(() => {
    if (trigger == 'login') setModal('login')
    if (trigger == 'signup') setModal('signup')

  }, [trigger])


  useEffect(() => {
    if(!loading) return;

    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length)
    }, 500)
    return () => clearInterval(interval)
  }, [loading])


  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-5xl animate-pulse ">
            {icons[iconIndex]}
          </div>
        </div>
      )}
      {/* nav */}
      <nav className="backdrop-blur-sm bg-white/30 fixed top-0 w-full z-50 border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src={Logo} alt="logo" width={40} height={40} className="rounded-full" />
            <span className="text-green-800 font-bold text-xl">RecipeBook</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-4 items-center">
            <button
              onClick={() => toggleModal('login')}
              className="px-4 py-2 text-sm rounded-full text-green-700 border border-green-600 hover:bg-green-600 hover:text-white transition"
            >
              Login
            </button>
            <button
              onClick={() => toggleModal('signup')}
              className="px-4 py-2 text-sm rounded-full bg-green-600 text-white hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X className="w-6 h-6 text-green-800" /> : <Menu className="w-6 h-6 text-green-800" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
            <button
              onClick={() => toggleModal('login')}
              className="w-full px-4 py-2 text-green-700 border border-green-600 rounded-full hover:bg-green-100"
            >
              Login
            </button>
            <button
              onClick={() => toggleModal('signup')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* login logout modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-xl p-6 relative shadow-xl">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 text-lg hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-xl text-green-800 font-bold mb-4 text-center p-2">
              {modal === 'login' ? 'Login' : 'Create Account'}
            </h2>

                {modal === 'login' ? (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true)
                    await handleLogin(e);
                    setLoading(false)
                    }}
                    className='space-y-4 p-2'
                  >
                    <input 
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded text-black" 
                      disabled={loading}
                    />
                     <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded text-black"
                      disabled={loading}
                    />
                    <span className='text-sm text-black m-2 no-underline hover:underline right-3 bottom-3'>Forget password?</span>
                    <button type="submit"
                      disabled={loading}
                      className="w-full h-12 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition mt-2"
                    >
                      Submit
                    </button> 
                  </form>
                ) : (
                  <form onSubmit={handleSignup} autoComplete='off' className='space-y-4 p-2'>
                    <input type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2 border rounded text-black" 
                    />
                    <input type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded text-black" 
                    />
                     <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded text-black"
                    />
                    <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mt-2">
                      Signup
                    </button> 
                  </form>

                )}

              {/* {modal === 'signup' && (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded text-black"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded text-black"
                  />
                </>
              )}
              {modal === 'login' && (
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded text-black"
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded text-black"
              />
              <span className='text-sm text-black m-2 no-underline hover:underline right-3 bottom-3'>Forget password?</span>
              <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mt-2">
                {modal === 'login' ? 'login' : 'signup'}
              </button> */}
          </div>
        </div>
      )}
    </>
  )
}

'use client'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import Logo from '../../public/images/bite_cult_logo.png'
import { LogIn, User, Users, Images, SquarePen } from 'lucide-react'
import { motion } from 'framer-motion'
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
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)



  const router = useRouter()
  const containerRef = useRef()

  const toggleModal = (type) => setModal(type)
 

  // scroll behavior: move logo to bottom
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY> 100 )
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])



  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

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

  const closeModal = () => {
    setModal(null);
    setUsername('');
    setEmail('');
    setPassword('');
  }

  const switchToSignup = () => {
    setModal('signup');
    setUsername('');
    setEmail('');
    setPassword('');
  }

  const switchToLogin = () => {
    setModal('login');
    setUsername('');
    setEmail('')
    setPassword('');
  }

    const buttons = [
    {label: 'Login', icon: LogIn, action: () => toggleModal('login'), color: 'bg-rose-500'},
    {label: 'About', icon: User, action: () => router.push('#about'), color: 'bg-green-500'},
    {label: 'Community', icon: Users, action: () => router.push('#joinCommunity'), color: 'bg-sky-400'},
    {label: 'Gallery', icon: Images, action: () => router.push('#gallery'), color: 'bg-zinc-500' },
    {label: "Blogs", icon: SquarePen, action: () => alert('Coming Soon!'), color: 'bg-orange-400'},

  ]


  // useEffect(() => {
  //   if(!loading) return;

  //   const interval = setInterval(() => {
  //     setIconIndex((prev) => (prev + 1) % icons.length)
  //   }, 500)
  //   return () => clearInterval(interval)
  // }, [loading])

{loading && (
  <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FF6B6B] border-opacity-80" />
  </div>
)}
  return (
    <>
      <div ref={containerRef}>
        <motion.div 
          className='fixed z-50' 
          initial={{ top: '1rem', left: '50%', x: '-50%' }}
          animate={{
            top: scrolled ? '1rem' : '1rem',
            left: scrolled ? '1rem' : '50%',
            x: scrolled ? '0%' : '-50%',
            transition: { duration: 0.5, ease: 'easeInOut'},
          }}
        >
          {/* logo btn */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            // onClick={!scrolled ? () => setMenuOpen( (prev) => !prev): undefined}
            className='w-24 h-24 rounded-full border-4 border-amber-300 shadow-ld bg-pink-300 flex items-center justify-center'
          >
              <Image 
                src={Logo}
                alt="Bite Cult Logo"
                width={160}
                height={80}
                className='"rounded-full'
              />

              {/* menu */}
              {/* <AnimatePresence> 
                {!scrolled && menuOpen && (
                  <motion.div
                    className='absolute inset-0 flex items-center justify-center my-4 mx-4'
                    initial={{ scale: 0 }}
                    animate= {{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {buttons.map((btn, index) => {
                       const arc = 180
                       const startAngle = 90 - arc / 2
                       const step = arc / (buttons.length - 1)
                       const angleDeg = startAngle + index * step
                       const angle = (angleDeg * Math.PI) / 180
                       const radius = 130


                      const x = Math.cos(angle) * radius
                      const y = Math.sin(angle) * radius

                       return (
                          <motion.button
                            key={btn.label}
                            onClick={btn.action}
                            className={`absolute text-white px-4 py-2 justify-between rounded-full shadow-lg ${btn.color} font-semibold`}
                            initial={{ opacity: 0, x: 0, y: 0 }}
                            animate={{ opacity: 1, x, y }}
                            transition={{ delay: 0.05 * index }}
                          >
                            {btn.emoji} {btn.label}
                          </motion.button>
                        )
                    })}

                  </motion.div>
                )} 
              </AnimatePresence> */}
          </motion.div>

        </motion.div>
      </div>
      {/* floting nav */}
      {scrolled && (
          <div className='fixed bottom-4 right-8 z-40 flex flex-col gap-4 bg-white/80 backdrop-blur-md px-4 py-4 rounded-full shadow-lg'>
              {buttons.map((btn, index) => (
                <button
                  key={index}
                  onClick={btn.action}
                  className="text-2xl hover:scale-110 transition"
                  title={btn.label}
                >
                  <btn.icon className='text-[#FF6B6B] font-black hover:text-pink-400' />
                </button>
              ))}
          </div>
        )}

    
      {/*Login/Signup Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[#F7FFF7] w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#FF6B6B] text-2xl font-bold hover:scale-110 transition"
            >
              ✕
            </button>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-center mb-6 text-[#FF6B6B]">
              {modal === 'login' ? 'Login' : 'Create Account'}
            </h2>

            {/* Form */}
            {modal === 'login' ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleLogin(e); 
                }}
                className="space-y-4"
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FF9F1C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] text-black placeholder-gray-500"
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FF9F1C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] text-black placeholder-gray-500"
                  disabled={loading}
                />
                <div className="text-right">
                  <span className="text-sm text-[#FF6B6B] cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#FF6B6B] text-[#F7FFF7] font-bold rounded-lg hover:bg-[#FF9F1C] transition"
                >
                  {loading ? 'Please wait...' : 'Login'}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSignup}
                autoComplete="off"
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FF9F1C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] text-black placeholder-gray-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FF9F1C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] text-black placeholder-gray-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#FF9F1C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] text-black placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF6B6B] text-[#F7FFF7] font-bold rounded-lg hover:bg-[#FF9F1C] transition"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Toggle Link */}
            <div className="mt-4 text-center">
              {modal === 'login' ? (
                <p className="text-sm text-[#333]">
                  Don&apos;t have an account?{' '}
                  <span
                    onClick={switchToSignup}
                    // onClick={() => setModal(switchToSignup)}
                    className="text-[#FF6B6B] font-semibold cursor-pointer hover:underline"
                  >
                    Create one
                  </span>
                </p>
              ) : (
                <p className="text-sm text-[#333]">
                  Already have an account?{' '}
                  <span
                    onClick={switchToLogin}
                    // onClick={() => setModal(switchToLogin)}
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

    </>
  )
}

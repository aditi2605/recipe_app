'use client'
import Image from 'next/image'
import Logo from '../../public/images/bite_cult_logo.png'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="text-[#1f1f1f] px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

        {/* Logo + Description */}
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Image src={Logo} alt="logo" width={80} height={80} className="rounded-full shadow-md" />
          </div>
          <p className="text-md text-gray-700 leading-relaxed">
            TastyCrave was born out of our shared love for food and the occasional frustration we felt whenever we wanted to try something new.{' '}
            <Link href="#about" className="font-semibold text-[#ff6b6b] hover:text-[#ff9f1c] transition underline">
              Read our story →
            </Link>
          </p>
        </div>

        {/* Links */}
        <div>
          <h5 className="font-bold text-lg text-[#ff6b6b] mb-4">🍽 Explore</h5>
          <ul className="text-md space-y-2">
            <li><Link href="#about" className="hover:text-[#ff9f1c] transition">👱🏻‍♀️ About Us</Link></li>
            <li><Link href="#joinCommunity" className="hover:text-[#ff9f1c] transition">🌍 Join Our Community</Link></li>
            <li><a href="#" className="hover:text-[#ff9f1c] transition">🍱 Explore Recipes</a></li>
            <li><a href="#" className="hover:text-[#ff9f1c] transition">✍🏻 Blogs</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h5 className="font-bold text-lg text-[#ff6b6b] mb-4">📬 Get Updates</h5>
          <p className="text-sm text-gray-600 mb-4">Subscribe for tasty updates, recipes & more!</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your Email"
              className="px-4 py-2 rounded-full border border-[#ff6b6b] focus:outline-none focus:ring-2 focus:ring-[#ff9f1c] w-full"
            />
            <button className="bg-[#ff6b6b] text-white px-5 py-2 rounded-full hover:bg-[#ff9f1c] transition text-sm font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-12 text-center text-sm text-gray-500 border-t pt-6">
        © 2025 <span className="font-semibold text-[#ff6b6b]">TastyCrave</span>. All Rights Deliciously Reserved.
      </div>
    </footer>
  )
}

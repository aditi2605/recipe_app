<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Quicksand&display=swap" rel="stylesheet" />
import { Geist, Geist_Mono, Chewy } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const chewy = Chewy({
  variable: "--font-chewy",
  weight:'400',
  subsets: ["latin"],
});

export const metadata = {
  title: "BiteCult",
  description: "Discover Flavors from Every Corner of the World",
   icons: {
    icon: "/images/bite_cult_logo.png", 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"  className={chewy.variable}>
      <body
        className={`${chewy.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

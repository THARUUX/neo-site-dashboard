import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "@/components/nav";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

export default function Layout({children}) {
  const { data: session } = useSession()
  if(!session) {
    return (
    <main className={`min-h-screen max-h-screen bg-gray-300 flex ${poppins.className}`}>
      <Nav/>
      <div className=" bg-white flex-grow mt-2 rounded-lg mr-3 mb-2 max-h-full overflow-y-auto">
        {children}      
      </div>
    </main>
    )
  }
  return (
    <main className="min-h-screen flex items-center justify-center">
      <button onClick={() => signIn('google')} className="bg-white text-lime-600 px-3 py-2 rounded-lg shadow-lg">
        Login With Google
      </button>
    </main>
  )
}
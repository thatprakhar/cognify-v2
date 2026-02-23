"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { LogIn, LogOut, User } from "lucide-react"

export function UserNav() {
 const { data: session, status } = useSession()

 if (status === "loading") {
 return <div className="w-8 h-8 rounded-full bg-zinc-100 animate-pulse" />
 }

 if (session) {
 return (
 <div className="flex items-center gap-3">
 <div className="flex flex-col items-end hidden sm:flex">
 <span className="text-xs font-medium text-zinc-900 ">{session.user?.name}</span>
 <span className="text-[10px] text-zinc-500 ">{session.user?.email}</span>
 </div>
 <button
 onClick={() => signOut()}
 className="group relative flex items-center justify-center"
 >
 {session.user?.image ? (
 <img
 src={session.user.image}
 alt={session.user.name || "User"}
 className="w-8 h-8 rounded-full border border-zinc-200 object-cover"
 />
 ) : (
 <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 ">
 <User size={16} className="text-zinc-500" />
 </div>
 )}
 <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-zinc-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
 <LogOut size={10} className="text-zinc-500" />
 </div>
 </button>
 </div>
 )
 }

 return (
 <button
 onClick={() => signIn()}
 className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-black bg-zinc-50 border border-zinc-200 rounded-lg transition-colors"
 >
 <LogIn size={14} />
 Sign In to Save
 </button>
 )
}

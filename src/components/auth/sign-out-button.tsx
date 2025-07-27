'use client'
import { LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export const SignOutButton = () => {
  return (
    <button 
      onClick={() => authClient.signOut()}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full"
    >
      <LogOut className="w-5 h-5" />
      <span>Sign Out</span>
    </button>
  )
}
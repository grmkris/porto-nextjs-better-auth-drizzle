'use client'
import { LogOut } from "lucide-react"
import { Button } from "../ui/button"
import { authClient } from "@/lib/auth-client"

export const SignOutButton = () => {
  return (
    <Button type="submit" variant="outline" className="w-full" onClick={() => authClient.signOut()}>
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  )
}
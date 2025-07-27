"use client";
import { LogOut } from "lucide-react";
import { useDisconnect } from "wagmi";

interface SignOutButtonProps {
  variant?: "default" | "dropdown";
  className?: string;
}

export const SignOutButton = ({
  variant = "default",
  className,
}: SignOutButtonProps) => {
  const { disconnect } = useDisconnect();

  if (variant === "dropdown") {
    return (
      <div
        onClick={() => disconnect()}
        className={className || "flex items-center cursor-pointer"}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign Out</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => disconnect()}
      className={
        className ||
        "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full"
      }
    >
      <LogOut className="w-5 h-5" />
      <span>Sign Out</span>
    </button>
  );
};

"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth/client"
import { IoLogOutOutline, IoChevronDownOutline } from "react-icons/io5"

interface UserNavProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()
  const displayName =
    user?.name?.trim() || user?.email?.split("@")[0] || "Guest"
  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? "?")

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/60"
        >
          <Avatar className="size-7">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-sm font-medium text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[120px] truncate text-sm font-medium lg:block">
            {displayName}
          </span>
          <IoChevronDownOutline
            className="size-3 text-muted-foreground"
            data-icon="inline-end"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="shadowforeground/5 w-56 rounded-xl border border-border/50 bg-popover p-1 shadow-xl"
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium text-foreground">
              {displayName}
            </p>
            <p className="text-sm leading-none text-muted-foreground">
              {user?.email ?? "Sign in to get started"}
            </p>
          </div>
        </DropdownMenuLabel>
        {user && (
          <>
            <DropdownMenuSeparator className="bg-border/50" />
            <div className="py-1">
              <DropdownMenuItem
                className="cursor-pointer gap-2 rounded-lg px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
                onClick={handleSignOut}
              >
                <IoLogOutOutline className="size-4" data-icon="inline-start" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

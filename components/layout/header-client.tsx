"use client"

import { Menu } from "lucide-react"
import { UserNav } from "./user-nav"
import { useSidebar } from "./sidebar-context"
import { Button } from "@/components/ui/button"

interface HeaderClientProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function HeaderClient({ user }: HeaderClientProps) {
  const { open } = useSidebar()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={open}
        className="text-muted-foreground hover:text-foreground lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="size-5" />
      </Button>
      <div className="flex flex-1 items-center justify-end gap-3">
        <UserNav user={user} />
      </div>
    </header>
  )
}

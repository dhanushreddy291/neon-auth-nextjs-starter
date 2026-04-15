"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import {
  LayoutDashboard,
  LogIn,
  KeyRound,
  Layers,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Login",
    href: "/login",
    icon: LogIn,
  },
  {
    title: "Session",
    href: "/session",
    icon: KeyRound,
  },
  {
    title: "Tokens",
    href: "/tokens",
    icon: Layers,
  },
  {
    title: "Protected API",
    href: "/protected-api",
    icon: ShieldCheck,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, close } = useSidebar()

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={close}
      />
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-60 flex-col border-r border-border/50 bg-sidebar transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-[-100%]"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border/50 px-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/20 transition-shadow group-hover:shadow-primary/30">
              <Zap className="size-4" data-icon="inline-start" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Auth Demo
            </span>
          </Link>
          <button
            onClick={close}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <div className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                  )}
                  <item.icon
                    className={cn(
                      "size-4 shrink-0 transition-transform duration-200",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground",
                      !isActive && "group-hover:translate-x-0.5"
                    )}
                    data-icon="inline-start"
                  />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-border/50 p-4">
          <div className="rounded-lg bg-muted/30 p-3.5">
            <p className="text-sm font-medium text-muted-foreground">
              Neon Auth
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Next.js Starter
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

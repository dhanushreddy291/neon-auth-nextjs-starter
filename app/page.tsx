import { auth } from "@/lib/auth/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  KeyRound,
  Layers,
  ShieldCheck,
  LogIn,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const { data: session } = await auth.getSession()
  const user = session?.user

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? "?")

  const navCards = [
    {
      title: "Login",
      description: "Sign in with email/password, email OTP, or OAuth",
      href: "/login",
      icon: LogIn,
      color: "text-blue-500",
    },
    {
      title: "Session",
      description: "View client and server session data",
      href: "/session",
      icon: KeyRound,
      color: "text-purple-500",
    },
    {
      title: "Tokens",
      description: "Inspect authentication tokens and their decoded payloads",
      href: "/tokens",
      icon: Layers,
      color: "text-amber-500",
    },
    {
      title: "Protected API",
      description: "Test authenticated API endpoints",
      href: "/protected-api",
      icon: ShieldCheck,
      color: "text-emerald-500",
    },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Auth Playground
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore how authentication works in a real app with Neon Auth
        </p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <CardHeader className="relative">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 shadow-lg ring-2 ring-background sm:size-12">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-sm font-medium text-primary-foreground sm:text-base">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <CardTitle className="text-base font-medium">
                  {user?.name ?? "Guest User"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {user?.email ?? "Sign in to get started"}
                </p>
              </div>
            </div>
            {user ? (
              <Badge variant="success" className="gap-1.5 px-2.5">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                Authenticated
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1.5 px-2.5">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                Guest
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                User ID
              </p>
              <p className="truncate rounded-lg bg-muted/30 px-2 py-1.5 text-sm text-muted-foreground/90">
                {user?.id ?? "—"}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Email Verified
              </p>
              <p className="rounded-lg bg-muted/30 px-2 py-1.5 text-sm text-muted-foreground/90">
                {user ? "Yes" : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">
            Quick Navigation
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {navCards.map((card) => (
            <Link key={card.href} href={card.href} className="group">
              <Card className="h-full transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg bg-muted/50 ${card.color}`}
                      >
                        <card.icon
                          className="size-4"
                          data-icon="inline-start"
                        />
                      </div>
                      <CardTitle className="text-sm font-medium">
                        {card.title}
                      </CardTitle>
                    </div>
                    <ArrowRight
                      className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground"
                      data-icon="inline-end"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

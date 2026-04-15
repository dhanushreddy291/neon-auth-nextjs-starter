"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShieldCheck, XCircle, Zap, ArrowRight } from "lucide-react"

interface ApiResponse {
  message?: string
  user?: {
    id: string
    name: string | null
    email: string | null
  }
  allUserData?: Record<string, unknown>
  error?: string
  timestamp?: string
}

export default function ProtectedApiPage() {
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const callProtectedApi = async () => {
    setIsLoading(true)
    setStatus("idle")
    setResponse(null)

    try {
      const res = await fetch("/api/profile")
      const data = await res.json()

      setResponse(data)
      setStatus(res.ok ? "success" : "error")
    } catch {
      setResponse({
        error: "Network error",
        message: "Failed to fetch from protected endpoint",
      })
      setStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Protected API</h1>
        <p className="text-sm text-muted-foreground">
          Test authenticated API endpoints with session validation
        </p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
        <CardHeader className="relative pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10">
                <ShieldCheck
                  className="size-4 text-emerald-500"
                  data-icon="inline-start"
                />
              </div>
              <div className="space-y-0.5">
                <CardTitle className="flex items-center gap-2 text-base">
                  GET /api/profile
                </CardTitle>
                <CardDescription className="text-sm">
                  A protected endpoint that requires valid authentication
                </CardDescription>
              </div>
            </div>
            {status !== "idle" && (
              <Badge
                variant={status === "success" ? "success" : "destructive"}
                className="gap-1.5"
              >
                {status === "success" ? (
                  <>
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Success
                  </>
                ) : (
                  <>
                    <span className="size-1.5 rounded-full bg-destructive" />
                    Unauthorized
                  </>
                )}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <Button
            onClick={callProtectedApi}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2
                  className="size-4 animate-spin"
                  data-icon="inline-start"
                />
                Calling API...
              </>
            ) : (
              <>
                <Zap className="size-4" data-icon="inline-start" />
                Call Protected API
                <ArrowRight className="ml-1 size-3.5" data-icon="inline-end" />
              </>
            )}
          </Button>

          {response && (
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Response
              </p>
              <div className="group relative">
                <pre className="overflow-auto rounded-xl border border-border/50 bg-muted/30 p-4 text-sm leading-relaxed">
                  <code className="text-foreground/80">
                    {JSON.stringify(response, null, 2)}
                  </code>
                </pre>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle
                  className="size-4 text-destructive"
                  data-icon="inline-start"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  {response?.error ?? "Request failed"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {response?.message ?? "The server returned an error status"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <CardHeader className="relative pb-3">
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-3 text-sm text-muted-foreground">
          <p>
            This page demonstrates how to call a protected API endpoint that
            requires authentication. The API validates the session cookies and
            returns user data only if the request is authenticated.
          </p>
          <p>
            The endpoint at{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              /api/profile
            </code>{" "}
            uses{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              auth.getSession()
            </code>{" "}
            to verify the user&apos;s session before returning any data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TokenContent } from "./token-content"
import { KeyRound, FileJson, ShieldCheck } from "lucide-react"
import { authClient } from "@/lib/auth/client"

export default function TokensPage() {
  const { data } = authClient.useSession()

  const accessToken = data?.session?.token ?? null

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Tokens</h1>
        <p className="text-sm text-muted-foreground">
          Inspect authentication tokens and their decoded payloads
        </p>
      </div>

      <Tabs defaultValue="access" className="space-y-4">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="access" className="gap-2">
            <KeyRound className="size-3.5" data-icon="inline-start" />
            Access
          </TabsTrigger>
          <TabsTrigger value="decoded" className="gap-2">
            <FileJson className="size-3.5" data-icon="inline-start" />
            Decoded
          </TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="space-y-4">
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent" />
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10">
                    <KeyRound
                      className="size-4 text-blue-500"
                      data-icon="inline-start"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <CardTitle className="text-base">Access Token</CardTitle>
                    <CardDescription className="text-sm">
                      JWT token used for authenticated API requests
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Bearer Token
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <TokenContent token={accessToken} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decoded" className="space-y-4">
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent" />
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10">
                    <FileJson
                      className="size-4 text-purple-500"
                      data-icon="inline-start"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <CardTitle className="text-base">JWT Session</CardTitle>
                    <CardDescription className="text-sm">
                      Session payload from useSession() in the client
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Client Session
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative">
              {accessToken ? (
                <DecodedSession token={accessToken} />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted/50">
                    <ShieldCheck className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No token or session data available. Sign in to inspect JWT
                    details.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DecodedSession({ token }: { token: string | null }) {
  const decodedClaims = token ? decodeJWTClaims(token) : null

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Raw JWT
        </p>
        <TokenContent token={token} />
      </div>

      {decodedClaims ? (
        <div className="space-y-1.5">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            JWT Claims
          </p>
          <pre className="overflow-auto rounded-xl border border-border/50 bg-muted/30 p-4 text-sm leading-relaxed">
            <code className="text-foreground/80">
              {JSON.stringify(decodedClaims, null, 2)}
            </code>
          </pre>
        </div>
      ) : null}
    </div>
  )
}

function decodeJWTClaims(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

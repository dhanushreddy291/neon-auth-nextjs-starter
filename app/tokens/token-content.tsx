"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, ShieldCheck } from "lucide-react"

interface TokenContentProps {
  token: string | null
}

export function TokenContent({ token }: TokenContentProps) {
  const [copied, setCopied] = useState(false)

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted/50">
          <ShieldCheck className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          No token available. Sign in to see the token.
        </p>
      </div>
    )
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon-xs"
          className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check
              className="size-3 text-emerald-500"
              data-icon="inline-start"
            />
          ) : (
            <Copy className="size-3" data-icon="inline-start" />
          )}
        </Button>
      </div>
      <pre className="overflow-auto rounded-xl border border-border/50 bg-muted/30 p-4 text-sm leading-relaxed break-all">
        <code className="text-foreground/80">{token}</code>
      </pre>
    </div>
  )
}

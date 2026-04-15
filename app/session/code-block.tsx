"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = "json" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
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
      <pre className="overflow-auto rounded-xl border border-border/50 bg-muted/30 p-4 text-sm leading-relaxed">
        <code className={`language-${language} text-foreground/80`}>
          {code || "null"}
        </code>
      </pre>
    </div>
  )
}

"use client"

import { authClient } from "@/lib/auth/client"
import { CodeBlock } from "./code-block"
import { Skeleton } from "@/components/ui/skeleton"

export function ClientSession() {
  const { data, isPending, error } = authClient.useSession()

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        Error loading session: {error.message}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          User Object
        </p>
        <CodeBlock
          code={JSON.stringify(data?.user ?? null, null, 2)}
          language="json"
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Session Object
        </p>
        <CodeBlock
          code={JSON.stringify(data?.session ?? null, null, 2)}
          language="json"
        />
      </div>
    </div>
  )
}

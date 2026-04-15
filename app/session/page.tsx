import { auth } from "@/lib/auth/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ClientSession } from "./client-session"
import { CodeBlock } from "./code-block"
import { KeyRound, Monitor } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SessionPage() {
  const { data: serverSession } = await auth.getSession()

  const sessionData = {
    user: serverSession?.user ?? null,
    session: serverSession?.session ?? null,
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Session</h1>
        <p className="text-sm text-muted-foreground">
          View current authentication session data from client and server
        </p>
      </div>

      <Tabs defaultValue="client" className="space-y-4">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="client" className="gap-2">
            <Monitor className="size-3.5" data-icon="inline-start" />
            Client
          </TabsTrigger>
          <TabsTrigger value="server" className="gap-2">
            <KeyRound className="size-3.5" data-icon="inline-start" />
            Server
          </TabsTrigger>
        </TabsList>

        <TabsContent value="client" className="space-y-4">
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Monitor
                      className="size-4 text-primary"
                      data-icon="inline-start"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <CardTitle className="flex items-center gap-2 text-base">
                      Client Session
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Session data available in client components
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  useSession()
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <ClientSession />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server" className="space-y-4">
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent" />
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10">
                    <KeyRound
                      className="size-4 text-purple-500"
                      data-icon="inline-start"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <CardTitle className="flex items-center gap-2 text-base">
                      Server Session
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Session data from auth.getSession() in server components
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Server Component
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <Separator />
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    User Object
                  </p>
                  <CodeBlock
                    code={JSON.stringify(sessionData.user, null, 2)}
                    language="json"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Session Object
                  </p>
                  <CodeBlock
                    code={JSON.stringify(sessionData.session, null, 2)}
                    language="json"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

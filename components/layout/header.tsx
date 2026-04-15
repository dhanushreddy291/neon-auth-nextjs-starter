import { auth } from "@/lib/auth/server"
import { HeaderClient } from "./header-client"

export async function Header() {
  const { data: session } = await auth.getSession()

  return <HeaderClient user={session?.user ?? null} />
}

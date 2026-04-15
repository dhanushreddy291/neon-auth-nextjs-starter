import { auth } from "@/lib/auth/server"

export async function GET() {
  const { data: session } = await auth.getSession()

  if (!session?.user) {
    return Response.json(
      {
        error: "Unauthorized",
        message: "You must be signed in to access this endpoint",
      },
      { status: 401 }
    )
  }

  return Response.json({
    message: "Secure data retrieved",
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    allUserData: session,
    timestamp: new Date().toISOString(),
  })
}

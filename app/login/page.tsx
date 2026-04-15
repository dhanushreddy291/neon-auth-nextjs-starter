"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithEmail, signUpWithEmail } from "./actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth/client"
import {
  Loader2,
  Mail,
  Lock,
  KeyRound,
  CheckCircle,
  User,
  ArrowRight,
} from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

type AuthMode = "initial" | "password" | "otp" | "signup"

export default function LoginPage() {
  const [signInState, signInFormAction, isSignInPending] = useActionState(
    signInWithEmail,
    null
  )
  const [signUpState, signUpFormAction, isSignUpPending] = useActionState(
    signUpWithEmail,
    null
  )
  const [email, setEmail] = useState("")
  const [mode, setMode] = useState<AuthMode>("initial")
  const [otpEmail, setOtpEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [otpRequested, setOtpRequested] = useState(false)
  const [otpMessage, setOtpMessage] = useState<string | null>(null)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [isSendOtpPending, setIsSendOtpPending] = useState(false)
  const [isVerifyOtpPending, setIsVerifyOtpPending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isOAuthReturn = searchParams.get("oauth") === "1"

  useEffect(() => {
    if (signInState?.success || signUpState?.success) {
      window.location.assign("/")
    }
  }, [signInState?.success, signUpState?.success])

  useEffect(() => {
    if (!isSessionPending && isOAuthReturn && session?.user) {
      window.location.assign("/")
    }
  }, [isSessionPending, isOAuthReturn, session?.user])

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/login?oauth=1",
    })
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.refresh()
  }

  const resetOtpFeedback = () => {
    setOtpError(null)
    setOtpMessage(null)
  }

  const handleContinue = () => {
    if (!email.trim()) return
    setOtpEmail(email.trim())
    setMode("password")
  }

  const handleSendOtp = async () => {
    if (!otpEmail.trim()) {
      resetOtpFeedback()
      setOtpError("Enter your email first")
      return
    }

    resetOtpFeedback()
    setIsSendOtpPending(true)

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: otpEmail.trim(),
      type: "sign-in",
    })

    setIsSendOtpPending(false)

    if (error) {
      setOtpError(error.message || "Failed to send sign-in code")
      return
    }

    setOtpRequested(true)
    setOtpMessage("We sent a 6-digit code to your email.")
  }

  const handleVerifyOtp = async () => {
    if (!otpEmail.trim()) {
      resetOtpFeedback()
      setOtpError("Enter your email first")
      return
    }

    if (!otpCode.trim()) {
      resetOtpFeedback()
      setOtpError("Enter the OTP code")
      return
    }

    resetOtpFeedback()
    setIsVerifyOtpPending(true)

    const { error } = await authClient.signIn.emailOtp({
      email: otpEmail.trim(),
      otp: otpCode.trim(),
    })

    setIsVerifyOtpPending(false)

    if (error) {
      setOtpError(error.message || "Failed to verify sign-in code")
      return
    }

    window.location.assign("/")
  }

  if (isSessionPending) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            You are already signed in
          </p>
        </div>
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <CardContent className="relative flex flex-col items-center justify-center py-12">
            <CheckCircle className="mb-4 size-12 text-emerald-500" />
            <p className="mb-6 text-center text-sm text-muted-foreground">
              You are already signed in as {session.user.email}
            </p>
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account or create a new one
        </p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <CardContent className="relative space-y-4 pt-6">
          <CardHeader className="px-0 pb-4">
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription className="text-sm">
              Enter your email to continue
            </CardDescription>
          </CardHeader>

          {mode === "initial" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleContinue}
                disabled={!email.trim()}
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleOAuthSignIn("google")}
                >
                  <FcGoogle className="size-4" />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleOAuthSignIn("github")}
                >
                  <FaGithub className="size-4" />
                  Continue with GitHub
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                New here?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Create an account
                </button>
              </p>
            </div>
          )}

          {mode === "password" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Mail className="size-4 text-muted-foreground" />
                <span className="text-sm">{otpEmail}</span>
                <button
                  type="button"
                  className="ml-auto text-xs text-primary hover:underline"
                  onClick={() => {
                    setMode("initial")
                    setEmail("")
                    setOtpEmail("")
                  }}
                >
                  Change
                </button>
              </div>

              <form
                action={signInFormAction}
                className="space-y-3"
              >
                <input type="hidden" name="email" value={otpEmail} />
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                </div>

                {signInState?.error && (
                  <p className="text-sm text-destructive">
                    {signInState.error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSignInPending}
                >
                  {isSignInPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 gap-2"
                  onClick={() => {
                    setMode("otp")
                    setOtpRequested(false)
                    setOtpCode("")
                    resetOtpFeedback()
                  }}
                >
                  <KeyRound className="size-4" />
                  Use one-time code
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?
                <button
                  type="button"
                  className="ml-1 text-primary hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </p>
            </div>
          )}

          {mode === "otp" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Mail className="size-4 text-muted-foreground" />
                <span className="text-sm">{otpEmail}</span>
                <button
                  type="button"
                  className="ml-auto text-xs text-primary hover:underline"
                  onClick={() => {
                    setMode("initial")
                    setEmail("")
                    setOtpEmail("")
                  }}
                >
                  Change
                </button>
              </div>

              {!otpRequested ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll send you a 6-digit code to sign in without a
                    password.
                  </p>
                  <Button
                    type="button"
                    className="w-full gap-2"
                    onClick={handleSendOtp}
                    disabled={isSendOtpPending || !otpEmail.trim()}
                  >
                    {isSendOtpPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      <>
                        <KeyRound className="size-4" />
                        Send sign-in code
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {otpMessage}
                  </p>
                  <div className="space-y-2">
                    <div className="relative">
                      <KeyRound className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        className="pl-10"
                        autoComplete="one-time-code"
                        value={otpCode}
                        onChange={(e) => {
                          setOtpCode(e.target.value)
                          resetOtpFeedback()
                        }}
                        autoFocus
                      />
                    </div>
                  </div>

                  {otpError && (
                    <p className="text-sm text-destructive">{otpError}</p>
                  )}

                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleVerifyOtp}
                    disabled={
                      isVerifyOtpPending || !otpEmail.trim() || !otpCode.trim()
                    }
                  >
                    {isVerifyOtpPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify and sign in"
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={() => {
                      setOtpRequested(false)
                      setOtpCode("")
                      resetOtpFeedback()
                    }}
                  >
                    Didn&apos;t receive a code? Send again
                  </Button>
                </>
              )}

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 gap-2"
                  onClick={() => {
                    setMode("password")
                    setOtpRequested(false)
                    setOtpCode("")
                    resetOtpFeedback()
                  }}
                >
                  <Lock className="size-4" />
                  Use password instead
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?
                <button
                  type="button"
                  className="ml-1 text-primary hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </p>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <User className="size-4 text-muted-foreground" />
                <span className="text-sm">Creating a new account</span>
                <button
                  type="button"
                  className="ml-auto text-xs text-primary hover:underline"
                  onClick={() => {
                    setMode("initial")
                    setEmail("")
                  }}
                >
                  Change
                </button>
              </div>

              <form action={signUpFormAction} className="space-y-3">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      name="name"
                      type="text"
                      placeholder="Your name"
                      className="pl-10"
                      required
                      autoFocus
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      defaultValue={email || otpEmail}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {signUpState?.error && (
                  <p className="text-sm text-destructive">
                    {signUpState.error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSignUpPending}
                >
                  {isSignUpPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 gap-2"
                  onClick={() => {
                    setMode("initial")
                    setEmail("")
                    setOtpEmail("")
                  }}
                >
                  Back to sign in
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

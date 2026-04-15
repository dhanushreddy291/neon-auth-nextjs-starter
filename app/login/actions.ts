"use server"

import { auth } from "@/lib/auth/server"

type AuthFormState = { error?: string; success?: string } | null

export async function signInWithEmail(
  _prevState: AuthFormState,
  formData: FormData
) {
  const { error } = await auth.signIn.email({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  })

  if (error) {
    return { error: error.message || "Failed to sign in" }
  }

  return { success: "Signed in successfully" }
}

export async function signUpWithEmail(
  _prevState: AuthFormState,
  formData: FormData
) {
  const name = (formData.get("name") as string).trim()
  const email = (formData.get("email") as string).trim()
  const password = formData.get("password") as string

  const { error } = await auth.signUp.email({
    name,
    email,
    password,
  })

  if (error) {
    return { error: error.message || "Failed to sign up" }
  }

  return { success: "Signed up successfully" }
}

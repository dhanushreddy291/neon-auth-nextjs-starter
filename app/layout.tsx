import { Manrope } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@/components/layout/sidebar-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", manrope.variable, "font-sans")}
    >
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <Sidebar />
            <div className="flex flex-1 flex-col lg:pl-72">
              <Header />
              <main className="flex-1 p-4 lg:p-6">{children}</main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type React from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { MobileNav } from "@/components/mobile-nav"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen overflow-x-hidden flex-col">
      <DashboardNavbar />
      <main className="flex-1 p-4 pt-20 bg-[#F9F9F9] md:p-6 md:pt-24">{children}</main>
      <MobileNav />
    </div>
  )
}

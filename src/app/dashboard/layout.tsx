import type React from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { MobileNav } from "@/components/mobile-nav"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex relative h-screen bg-[#F8F8FA] overflow-hidden flex-col">
      <DashboardNavbar />
      <main className="flex-1 px-4 pt-16 bg-[#F9F9F9] md:p-6 mb-16 md:mb-0 md:pt-24">{children}</main>
      <MobileNav />
    </div>
  )
}

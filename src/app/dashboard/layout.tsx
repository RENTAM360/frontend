"use client"
import type React from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { MobileNav } from "@/components/mobile-nav"
import { usePathname } from "next/navigation"
import clsx from "clsx"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()
  const isMessagesPage = pathname?.startsWith("/dashboard/messages")
  return (
    <div 
      className={clsx(
        "flex relative h-screen bg-[#F8F8FA] flex-col",
        isMessagesPage ? "overflow-hidden" : "overflow-y-auto"
      )}
    >
      <DashboardNavbar />
      <main 
        className={clsx(
          "flex-1 px-4 pt-16 bg-[#F9F9F9] md:p-6 mb-16 md:mb-0 md:pt-24",
          isMessagesPage && "overflow-hidden"
        )}
      >{children}
      </main>
      <MobileNav />
    </div>
  )
}

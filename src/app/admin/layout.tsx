"use client"

import type React from "react"
import { ComponentType, Suspense, useEffect, useState } from "react"
import { LayoutGrid, Users, MessageSquare, FileText, Settings, Bell, Search, X, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PageHeaderProvider } from "@/context/page-header-context"
import Image from "next/image"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [headerContent, setHeaderContent] = useState<React.ReactNode>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname();

  // Effect to grab the header content from the page
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const headerElement = document.getElementById("page-header-content")
      if (headerElement) {
        setHeaderContent(headerElement.innerHTML)
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <PageHeaderProvider>
      <div className="flex min-h-screen font-sans bg-[#FBFBFB]">
        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-40 w-[232px] bg-[#111111] text-white flex flex-col transform transition-transform duration-300 md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 flex items-center justify-between md:justify-start">
            <Image src="/adminLogo.svg" width={100} height={100} alt="Rentam360 Logo" />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-white p-2 rounded-full hover:bg-[#232323]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <NavItem href="/admin" icon={LayoutGrid} label="Dashboard" />
              <NavItem href="/admin/users" icon={Users} label="Users" />
              <NavItem href="/admin/messages" icon={MessageSquare} label="Messages" />
              <NavItem href="/admin/reports" icon={FileText} label="Reports" />
              <NavItem href="/admin/settings" icon={Settings} label="Settings" />
            </Suspense>
          </nav>

          <div className="p-4 border-t border-gray-800 mt-auto">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/diverse-group.png" alt="Agba" />
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-300">Agba Designer</p>
              </div>
            </div>
          </div>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 bg-opacity-40 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-x-hidden md:ml-[232px]">
          {/* Header */}
          <header className="border-b border-gray-100 bg-white sticky top-0 z-20">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 rounded-full hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </button>
                <div
                  className="hidden sm:block"
                  dangerouslySetInnerHTML={{ __html: headerContent as string }}
                />
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-200"
                >
                  <Bell className="h-5 w-5 text-gray-500" />
                </Button>
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-[180px] md:w-[250px] shadow-none pl-9 rounded-lg border border-[#EAEAEA]"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 md:p-6 flex-1">{children}</main>
        </div>
      </div>
    </PageHeaderProvider>
  )
}

// Component for navigation items
function NavItem({ icon: Icon, label, href }: { icon: ComponentType<{ className?: string }>; label: string; href: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href))

  return (
    <Link href={href} className="block">
      <div
        className={`flex items-center gap-3 py-2 px-3 rounded-md mb-1 cursor-pointer transition-colors ${
          isActive ? "bg-[#232323] text-white" : "hover:bg-[#232323] text-gray-300"
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  )
}

"use client"

import React, { createContext, useContext, type ReactNode } from "react"

type PageHeaderContextType = {
  setPageHeader: (header: ReactNode) => void
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined)

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [pageHeader, setPageHeader] = React.useState<ReactNode>(null)

  return (
    <PageHeaderContext.Provider value={{ setPageHeader }}>
      {children}
      {/* This is a hidden element that will be used by the layout */}
      <div id="page-header-content" className="hidden">
        {pageHeader}
      </div>
    </PageHeaderContext.Provider>
  )
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext)
  if (context === undefined) {
    throw new Error("usePageHeader must be used within a PageHeaderProvider")
  }
  return context
}

export function PageHeader({ children }: { children: ReactNode }) {
  const { setPageHeader } = usePageHeader()

  // Set the page header content when this component mounts
  React.useEffect(() => {
    setPageHeader(children)

    // Clean up when unmounting
    return () => setPageHeader(null)
  }, [children, setPageHeader])

  // This component doesn't render anything itself
  return null
}

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface SavedItem {
  id: string
  title: string
  category: string
  price: number
  rating: number
  imageUrl: string
}

interface SavedItemsContextType {
  savedItems: SavedItem[]
  isSaved: (id: string) => boolean
  toggleSaved: (item: SavedItem) => void
  removeSaved: (id: string) => void
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined)

export function SavedItemsProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()

  // Load saved items from localStorage on initial render
  useEffect(() => {
    const storedItems = localStorage.getItem("savedItems")
    if (storedItems) {
      setSavedItems(JSON.parse(storedItems))
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever savedItems changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("savedItems", JSON.stringify(savedItems))
    }
  }, [savedItems, isInitialized])

  const isSaved = (id: string) => {
    return savedItems.some((item) => item.id === id)
  }

  const toggleSaved = (item: SavedItem) => {
    if (isSaved(item.id)) {
      removeSaved(item.id)
    } else {
      setSavedItems((prev) => [...prev, item])
      toast({
        title: "Item saved",
        description: `${item.title} has been added to your saved items.`,
      })
    }
  }

  const removeSaved = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: "Item removed",
      description: "The item has been removed from your saved items.",
    })
  }

  return (
    <SavedItemsContext.Provider value={{ savedItems, isSaved, toggleSaved, removeSaved }}>
      {children}
    </SavedItemsContext.Provider>
  )
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext)
  if (context === undefined) {
    throw new Error("useSavedItems must be used within a SavedItemsProvider")
  }
  return context
}

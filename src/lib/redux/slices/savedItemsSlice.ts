import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface SavedItem {
  id: string
  title: string
  category: string
  price: number
  rating: number
  imageUrl: string
}

// Load initial state from localStorage if available
const loadSavedItems = (): SavedItem[] => {
  if (typeof window !== 'undefined') {
    const storedItems = localStorage.getItem('savedItems')
    if (storedItems) {
      return JSON.parse(storedItems)
    }
  }
  return []
}

interface SavedItemsState {
  items: SavedItem[]
}

const initialState: SavedItemsState = {
  items: loadSavedItems()
}

export const savedItemsSlice = createSlice({
  name: 'savedItems',
  initialState,
  reducers: {
    addSavedItem: (state, action: PayloadAction<SavedItem>) => {
      // Only add if not already saved
      if (!state.items.some(item => item.id === action.payload.id)) {
        state.items.push(action.payload)
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('savedItems', JSON.stringify(state.items))
        }
      }
    },
    removeSavedItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedItems', JSON.stringify(state.items))
      }
    },
    syncSavedItem: (state, action: PayloadAction<{ id: string; updates: Partial<SavedItem> }>) => {
      const { id, updates } = action.payload
      const itemIndex = state.items.findIndex((item) => item.id === id)
      if (itemIndex !== -1) {
        state.items[itemIndex] = { ...state.items[itemIndex], ...updates }
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("savedItems", JSON.stringify(state.items))
        }
      }
    },
  }
})

// Export actions
export const { addSavedItem, removeSavedItem, syncSavedItem } = savedItemsSlice.actions

// Export selectors
export const selectSavedItems = (state: RootState) => state.savedItems.items
export const selectIsSaved = (state: RootState, id: string) => 
  state.savedItems.items.some(item => item.id === id)

export default savedItemsSlice.reducer

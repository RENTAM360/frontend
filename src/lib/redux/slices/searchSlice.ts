import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface SearchState {
    term: string
}

const initialState: SearchState = {
    term: "",
}

const SearchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.term = action.payload
        },
        clearSearchTerm: (state) => {
            state.term = ""
        }
    }
})

export const { setSearchTerm, clearSearchTerm } = SearchSlice.actions
export default SearchSlice.reducer
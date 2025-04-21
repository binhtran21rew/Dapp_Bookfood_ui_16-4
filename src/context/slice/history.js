import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const HistorySlice = createSlice({
    name: 'history',
    initialState: {
        data: [],

    },
    reducers: {
        addHistoryData: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.data.find(item => item.id === newItem.id);

            if (!existingItem) {
                state.data.push(newItem);
              }
        },

      
    },
})

export const { addHistoryData, } = HistorySlice.actions;
const historyReducer = HistorySlice.reducer;

export default historyReducer;
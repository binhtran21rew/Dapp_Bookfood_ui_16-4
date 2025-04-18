import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
    name: 'order',
    initialState: {
        data: [],
        item: {}
    },
    reducers: {
        addOrderData: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.data.find(item => item.id === newItem.id);
      
            if (existingItem) {
              existingItem.quantity = (existingItem.quantity || 0) + 1;
            } else {
              state.data.push({ ...newItem, quantity: 1 });
            }
        },

        updateItemQuantity: (state, action) => {
          const { id, quantity } = action.payload;
          const itemToUpdate = state.data.find(item => item.id === id);
    
          if (itemToUpdate) {
            itemToUpdate.quantity = Math.max(1, quantity);
          }
        },

        getItemId: (state, action) => {
          const { id } = action.payload;
          console.log("lay id", id);
          
          const foundItem = state.data.find(item => item.id === id);

          if (foundItem) {
            state.item = foundItem; // Cập nhật state item với item tìm thấy
          } else {
            state.item = {}; // Hoặc bạn có thể đặt là null tùy theo logic
          }

        },

        resetOrderData: (state) => {
            state.data = [];
        },
    },
})

export const { addOrderData, updateItemQuantity, getItemId, resetOrderData} = OrderSlice.actions;
const orderReducer = OrderSlice.reducer;

export default orderReducer;
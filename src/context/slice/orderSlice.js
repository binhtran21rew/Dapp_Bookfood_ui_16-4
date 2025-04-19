import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
    name: 'order',
    initialState: {
        data: [],
        item: {},
        note: [],
        order: []
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
          const itemToUpdate = state.order.find(item => item.id === id);
          
          if (itemToUpdate) {
            itemToUpdate.quantity = Math.max(1, quantity);
          }

          const itemToUpdateInData = state.data.find(item => item.id === id);
          if (itemToUpdateInData) {
            itemToUpdateInData.quantity = Math.max(1, quantity);
          }
        },

        getOrder: (state, action) => {
          const { id } = action.payload;
         
          const existingItem =  state.data.filter(item => item.restaurantId === id);
          
          if(existingItem){
            state.order = existingItem;
          }
        },
        placeOrder: (state, action) => {
          const orderedItemIds = state.order.map(item => item.id);
          state.data = state.data.filter(item => !orderedItemIds.includes(item.id));
          state.order = [];
        },

        getItemId: (state, action) => {
          const { id } = action.payload;
          
          const foundItem = state.order.find(item => item.id === id);
          
          if (foundItem) {
            state.item = foundItem; // Cập nhật state item với item tìm thấy
          } else {
            state.item = {}; // Hoặc bạn có thể đặt là null tùy theo logic
          }
        },

        updateNote: (state, action) => {
          const { id, type, value, sizeOptions } = action.payload;
          const existingNoteIndex = state.note.findIndex((note) => note.id === id);

          const newNoteData = {
            id: id,
            note: type === "note" ? value : state.note.find(n => n.id === id)?.note || "",
            size: type === "size" && sizeOptions ? sizeOptions[value] : state.note.find(n => n.id === id)?.size || "", 
          };

          if (existingNoteIndex !== -1) {
            state.note[existingNoteIndex] = { ...state.note[existingNoteIndex], ...newNoteData };
          } else {
            state.note.push(newNoteData);
          }
        },
        removeOrderItem: (state, action) => {
          const { id } = action.payload;
    
          state.order = state.order.filter(item => item.id !== id);
          state.data = state.data.filter(item => item.id !== id)
          state.note = state.note.filter(note => note.id !== id);
    
          if (state.item.id === id) {
            state.item = {};
          }
        },

        resetOrderData: (state) => {
            state.data = [];

        },

        resetNote: (state) => {
          state.note = []
        },

        resetItem: (state) => {
          state.item = {};
        },
        resetOrder: (state) => {
          state.order = [];
        },    
    },
})

export const { addOrderData, updateItemQuantity, getItemId, updateNote, getOrder, placeOrder, removeOrderItem, resetOrderData, resetItem, resetNote, resetOrder} = OrderSlice.actions;
const orderReducer = OrderSlice.reducer;

export default orderReducer;
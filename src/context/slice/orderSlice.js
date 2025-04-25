import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
    name: 'order',
    initialState: {
        data: [],
        item: {},
        note: [],
        order: [],
        lastItem: null,
    },
    reducers: {
        addOrderData: (state, action) => {
          const newItem = action.payload;
          const existingItemIndex = state.data.findIndex(item => item.id === newItem.id);
    
          if (existingItemIndex !== -1) {
            // Item đã tồn tại, tăng quantity
            state.data[existingItemIndex].quantity = (state.data[existingItemIndex].quantity || 0) + 1;
            // Cập nhật state.item với item đã tồn tại và quantity mới
            state.item = { ...state.data[existingItemIndex] };
          } else {
            // Item chưa tồn tại, thêm mới vào data với quantity là 1
            const newItemWithQuantity = { ...newItem, quantity: 1 };
            state.data.push(newItemWithQuantity);
            state.item = { ...newItemWithQuantity };
          }
        },

        updateItemQuantity: (state, action) => {
          const { id, quantity } = action.payload;

          if(quantity === 0){
            state.data = state.data.filter(item => item.id !== id)
            state.note = state.note.filter(note => note.id !== id);
      
            if (state.item.id === id) {
              state.item = {};
            }

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
          // const orderedItemIds = state.order.map(item => item.id);
          // state.data = state.data.filter(item => !orderedItemIds.includes(item.id));
          // state.order = [];
          state.data = [];
        },

        getItemId: (state, action) => {
          const { id, food = null } = action.payload;
          
          const foundItem = state.data.find(item => item.id === id);
          
          if (foundItem) {
            state.item = foundItem; // Cập nhật state item với item tìm thấy
          } else {
            if (food) {
              state.item = { ...food, quantity: 0 }; // Gán food cho state.item và thêm quantity: 0
            } else {
              state.item = {}; // Hoặc bạn có thể đặt là null tùy theo logic khi không tìm thấy và không có food
            }
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
    
          // state.order = state.order.filter(item => item.id !== id);
          state.data = state.data.filter(item => item.id !== id)
          state.note = state.note.filter(note => note.id !== id);
    
          if (state.item.id === id) {
            state.item = {};
          }
        },

        updateLastItem: (state, action) => {
          const {id} = action.payload;
          console.log(id, 'dispatch');
          
          state.lastItem = id;
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

        resetLastItem: (state) => {
          state.lastItem = null;
        }
    },
})

export const { addOrderData, updateItemQuantity, getItemId, updateNote, getOrder, placeOrder, updateLastItem, removeOrderItem, resetOrderData, resetItem, resetNote, resetOrder, resetLastItem} = OrderSlice.actions;
const orderReducer = OrderSlice.reducer;

export default orderReducer;
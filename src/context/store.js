import {configureStore} from '@reduxjs/toolkit';

import orderReducer from "./slice/orderSlice";


export const store = configureStore({
    reducer: {
        order: orderReducer
    },
});

export default store;
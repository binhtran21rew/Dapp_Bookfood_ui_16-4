import {configureStore} from '@reduxjs/toolkit';

import orderReducer from "./slice/orderSlice";
import historyReducer from './slice/history';

export const store = configureStore({
    reducer: {
        order: orderReducer,
        history: historyReducer,
    },
});

export default store;
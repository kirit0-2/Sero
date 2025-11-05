import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/lib/persistStore";
import storage from "redux-persist/lib/storage";
import { authReducer } from "./reducer/authReducer";

const rootReducer = combineReducers({
    authStore: authReducer
})

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['authStore']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})

export const persistor = persistStore(store)
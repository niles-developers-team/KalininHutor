import { combineReducers, Store } from "redux";
import thunkMiddleware from 'redux-thunk';

import { AppState } from "./appState";

import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userStore";
import { bookingReducer } from "./bookingStore";
import { rentalObjectReducer } from "./rentalObjectStore";
import { snackbarReducer } from "./snackbarStore";


export default function configureAppStore(): Store<AppState> {
    const middlewares = [thunkMiddleware];

    return configureStore({
        reducer: {
            bookingState: bookingReducer,
            rentalObjectState: rentalObjectReducer,
            snackbarState: snackbarReducer,
            userState: userReducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
        devTools: process.env.NODE_ENV !== 'production',
    });
}
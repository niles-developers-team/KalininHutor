import { combineReducers, applyMiddleware, Store } from "redux";
import thunkMiddleware from 'redux-thunk';

import { AppState } from "../models/reduxModels";

import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({});

export default function configureAppStore(): Store<AppState> {
    const middlewares = [thunkMiddleware];

    const store = configureStore(
        {
            reducer: rootReducer,
            middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
            devTools: process.env.NODE_ENV !== 'production',
        }
    );

    return store;
}
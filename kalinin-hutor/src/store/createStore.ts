import { Store } from "redux";
import thunkMiddleware from 'redux-thunk';

import { AppState } from "./appState";

import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userStore";
import { bookingReducer } from "./bookingStore";
import { rentalObjectReducer } from "./rentalObjectStore";
import { notificationReducer } from "./notificationStore";
import { roomCharacteristicReducer } from "./roomCharacteristicStore";
import { roomVariantReducer } from "./roomVariantStore";

// export default configureStore({
//     reducer: {
//         rentalObjectsState: rentalObjectReducer
//     }
// });


export default function configureAppStore(): Store<AppState> {
    const middlewares = [thunkMiddleware];

    return configureStore({
        reducer: {
            bookingState: bookingReducer,
            rentalObjectState: rentalObjectReducer,
            notificationState: notificationReducer,
            userState: userReducer,
            roomCharacteristicState: roomCharacteristicReducer,
            roomVariantState: roomVariantReducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
        devTools: process.env.NODE_ENV !== 'production',
    });
}
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppState, AppThunkDispatch } from '../store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppThunkDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
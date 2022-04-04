import { appReducer,appReducerState } from './appReducers';
import { ActionReducerMap } from '@ngrx/store';

interface AppState{
    appReducers:appReducerState
}

export const reducers:ActionReducerMap<AppState> = {
    appReducers:appReducer
}

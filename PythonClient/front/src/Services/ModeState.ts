import {createAction, createReducer, on, props} from '@ngrx/store';


export const set = createAction('[Gpio Component] Set', props < {mode: string} >());
export const reset = createAction('[Gpio Component] Reset');

export const initialState = '';
export const modeReducer = createReducer(
  initialState,
  on(set, (state, { mode }) => mode),
  on(reset, (state) => initialState)
);

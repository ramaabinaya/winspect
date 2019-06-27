import { MetaReducer } from '@ngrx/store';
/**
 * Variable which is used to define the reset type;
 */
export const RESET_TYPE = 'RESET_STATE';
/**
 * To define the app state types.
 */
export interface AppState {
}
/**
 * Variable which is used to define the root reducer.
 */
export const rootReducer = {
};
/**
 * Method which is used to define the meta reducer for clearing the ngrx/store after logged out.
 * @param reducer Define the reducer.
 */
export function dataResetReducer(reducer) {
    return function (state: AppState, action) {
        if (action.type === RESET_TYPE) {
            state = undefined;
            return reducer(state, action);
        }
        return reducer(state, action);
    };
}
/**
 * Variable which is used to define the meta reducers.
 */
export const metaReducers: MetaReducer<any>[] = [dataResetReducer];

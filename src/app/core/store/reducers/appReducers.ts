import { CAB_ID, MAP_MESSAGE, ALL_CAB, IS_ALL, EMPTY_DATA, IS_SELECTED, INDEX } from '../actions/appActions';

export interface appReducerState {
    cab: Object,
    isOnline: boolean,
    mapMessage: any,
    allCabData: any,
    isAll: boolean,
    isSelected: boolean,
    selectedCab: any,
    selectedIndex: any
}


const initialState: appReducerState = {
    cab: '',
    isOnline: false,
    mapMessage: '',
    allCabData: {},
    isAll: false,
    isSelected: false,
    selectedCab: [],
    selectedIndex: ''
}

export function appReducer(state = initialState, action): appReducerState {
    // console.log(action.payload)
    switch (action.type) {
        case CAB_ID:
            return {
                ...state,
                cab: action.payload,
                allCabData: [],
                isAll: false,
                isSelected: false,
                selectedCab: [],
            }

        case MAP_MESSAGE:
            return {
                ...state,
                mapMessage: action.payload.mapMessage
            }
        case ALL_CAB:
            return {
                ...state,
                allCabData: action.payload
            }

        case IS_ALL:
            return {
                ...state,
                isAll: action.payload,
            }
        case IS_SELECTED:
            return {
                ...state,
                isSelected: action.payload
            }
        case EMPTY_DATA:
            return {
                ...state,
                cab: action.payload.cab,
                allCabData: action.payload.allCabData,
                isAll: action.payload.isAll,
                selectedCab: action.payload.selectedCab,
                isSelected: action.payload.isSelected,
                selectedIndex:action.payload.selectedIndex
            }

        // case INDEX:
        //     return {
        //         ...state,
        //         selectedIndex: action.payload.index
        //     }

    }
    return state;
}
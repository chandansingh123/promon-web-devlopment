export default function map(state = [], action) {
    switch (action.type) {
        case 'UPDATE_SEARCH_TEXT':
            return Object.assign({}, state, {...state, searchValue: action.searchValue, });
        case 'UPDATE_AUTO_COMPLETE_VALUE':
            return Object.assign({}, state, {...state, autoCompleteValue: action.autoCompleteValue});
        case'UPDATE_POP_UP_DETAIL':
            return Object.assign({}, state, {...state, popUpDetail: action.popUpDetail});
        case'UPDATE_PROJECT_SUMMARY':
            return Object.assign({}, state, {...state, projectSummary: action.projectSummary});
        case'UPDATE_BASE_LAYERS':
            return Object.assign({}, state, {...state, baseLayers: action.baseLayers});

        // Actions related to map baseline layer
        case 'SET_BASELINE':
            return Object.assign({}, state, { baseline: action.data, isFetching: false });

        // Actions related to overlay layer
        case 'REMOVE_OVERLAY_FROM_MAP':
            const overlayIndex = state.overlays.indexOf (action.overlayId);
            return Object.assign({}, state, {...state, overlays:[
                ...state.overlays.slice(0, overlayIndex),
                ...state.overlays.slice(overlayIndex + 1)
            ]});
        case 'ADD_OVERLAY_TO_MAP':
            return Object.assign({}, state, {overlays:[
                action.overlayId,
                ...state.overlays
            ]});

        // Actions related to filter layer
        case 'SET_FILTER_IN_MAP':
            return Object.assign ({}, state, { filters: action.filters });
        case 'SET_FILTERED_FEATURES':
            return Object.assign ({}, state, { filteredFeatures: action.filteredFeatures });

        case 'UPDATE_OVERLAY_COLORS':
            return Object.assign({}, state, {...state, overlayColors:action.overlayColors});
        case 'UPDATE_FEATURE_CACHE':
            return Object.assign({},state, {featuresCache : action.features});
        
        //Actions related to overlay
        case 'POP_UP_DETAIL_RECEIVED':
            return Object.assign({},state, {popUpDetail:action.userDetail})
        default:
            return state;
    }
}


export default function table (state = [], action) {
    switch (action.type) {
        // case 'TABLE_SURVEY_CHANGE':
        //     return Object.assign({}, state, {survey:action.survey});
        // case 'TABLE_SURVEY_FIELD_RECEIVED':
        //     return Object.assign({}, state, {surveyFields: action.surveyFields} );
        default:
            return state;
    }
}

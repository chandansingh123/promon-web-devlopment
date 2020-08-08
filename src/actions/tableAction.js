// import request from 'superagent';

// import config from 'config/config';

// export const tableSurveyChange = (survey) =>({
//     type:'TABLE_SURVEY_CHANGE',
//     survey
// })

// const surveyFieldReceived = (surveyFields) => ({
//     type:'TABLE_SURVEY_FIELD_RECEIVED',
//     surveyFields
// })

// export function updateSurveyFields(projectCode, surveyId){
//     const token = localStorage.getItem("token");
//     return function(dispatch){
//         return request.get(`${config.backend.url}/projects/${projectCode}/surveys/${surveyId}/survey-fields/`)
//         .set('Authorization',`Token ${token}`)
//         .end((error, response) => { 
//             if(!error && response){
//                 dispatch(surveyFieldReceived(response.body))
//             }else{
//                 console.log("Could not fetch survey data for survey: "+surveyId);
//             }
//         })
//     }
// }


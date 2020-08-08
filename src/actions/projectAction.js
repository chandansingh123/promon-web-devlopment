import config from 'config/config';
import { fetch, addStart, addCancel, formFieldChange,
         formSwitchToggle, addChildToParent, addFinish,
         editStart, updateFinish, _delete, removeChildFromParent} from './coreAction';

const module = 'project';
const url=`${config.backend.url}/projects/`;


export const  fetchAllProjects = () => fetch(module, url);

export const addProjectStart = () => addStart( module, {editing:true ,is_active:true, survey_type:true, project_map:true})

export function projectFormFieldChange (field, value, projects) {
  return function (dispatch) {
    switch (field) {
      case 'name':
        dispatch (formFieldChange (module, field, value));
        if (!projects.editMode) {
          const projectCode = value.replace(/[^a-zA-Z0-9]/gi,'').toLowerCase().substr (0, 20);
          dispatch (formFieldChange (module, 'code', projectCode));
        }
        break;
      default:
        dispatch (formFieldChange (module, field, value));
    }
  }
}


// Actions related to Edits

export const editProjectStart = (id) => editStart(module, id);

export const projectEditCancel = () => addCancel(module);

export const updateProject = (data) => updateFinish(module, data, `${url+data.code}/`);

export const projectFormToggleSwitch= (field) => formSwitchToggle(module, field);

export const saveProject = (data) => addFinish(module, data, url);

export const deleteProject = (id, obj) => _delete(module, id, `${url+obj.code}/`);

export const projectUserAddCancel = () => addCancel(module);

export const saveProjectUser = (projectCode, projectId, data, field) => addChildToParent(module,`${url+projectCode}/users/` , data, field, projectId)


// Actions related to Users in Project

const newUser = {
  editing: true,
  reports: [],
  permissions: []
}

export const addProjectUserStart = () => addStart ('projectUsers', newUser);

export const editProjectUserStart = (id) => editStart('projectUsers', id);

export const projectUserformFieldChange = (field, value) => formFieldChange('projectUsers', field, value);

export const projectUserEditCancel = _ => addCancel('projectUsers');

export const projectUserEditSave = (projectCode, data) => updateFinish('projectUsers', data, `${url}${projectCode}/users`);

export const projectUserAddSave = (projectCode, data) => updateFinish('projectUsers', data, `${url}${projectCode}`);

export const removeProjectUser = (projectCode, userId) => _delete('projectUsers', userId, `${url}${projectCode}/users/${userId}`);


// Actions related to base layers in Project

export const removeProjectBaselayer = (projectCode, layerCode, callback) => _delete(undefined, undefined, `${url}${projectCode}/base-layers/${layerCode}`, callback);

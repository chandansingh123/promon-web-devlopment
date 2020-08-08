export const PERMISSIONS = {
  SURVEY_APPROVAL: 'survey.approval',
  PROJECT_MANAGE: 'project.manage',
  SURVEY_CREATE: 'survey.create',
  SURVEY_DELETE: 'survey.delete'
};

export const PROJECT_PERMISSIONS = [
  { code: 'project.manage', text: 'User can access project management dashboard.' },
  { code: 'survey.create', text: 'User can add a new survey.' },
  { code: 'survey.approval', text: 'User can approve/reject survey data.' },
  { code: 'survey.delete', text: 'User can delete survey.' },
];

export const hasPermission = (permission, userPermissions, projectPermissions) => {
  if (userPermissions) {
    if (userPermissions.indexOf(permission) > -1)
      return true;
  }

  if (projectPermissions) {
    if (projectPermissions.indexOf(permission) > -1)
      return true;
  }

  return false;
}

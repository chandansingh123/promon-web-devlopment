
import React from 'react';

import config from 'config/config';
import InputField from 'components/Admin/Common/InputField';
import FlatButton from 'components/Common/FlatButton';
import ImageUploader from 'components/Common/ImageUploader';

const permissionMap = code => {
  switch (code) {
    case 'survey.approval': return 'Approve survey data.';
    default: return null;
  }
};


const UserProfile = ({ session, userProfile, editMode, viewMode, ui, formFieldChangeUserProfile }) => {
  const isEditMode = ui['profile.mode'] === 'edit';
  if (session.user)
    userProfile.newData = {
      first_name: session.user.first_name,
      middle_name: session.user.middle_name,
      last_name: session.user.last_name,
      ...userProfile.newData
    };

  return (
    <div>
      { session.user && session.country && session.permissions && session.projects &&
        <div style={{display: 'flex', flexDirection: 'row', padding: 20}}>
          <div style={{borderRight: '1px solid rgba(0,0,0,.1)'}}>
            <ImageUploader id='rem-upr-frm-pic' url={`${config.backend.url}/user/profile-picture`}
              currentImage={session.user.avatar} onSuccess={() => console.log ('done')} />
          </div>

          <div style={{padding: 20}}>

            <form id='rem-upr-frm'>
              <table style={{borderSpacing: '20px 0', borderCollapse: 'separate'}}>
                <tbody>
                  <tr>
                    <td></td>
                    <td style={{textAlign: 'right', paddingBottom: 20, width: 210}}>
                      {
                        isEditMode ?
                        <FlatButton id='rem-upr-frm-save' icon='save' label='Save' onClick={viewMode} /> :
                        <FlatButton id='rem-upr-frm-edit' icon='edit' label='Edit' onClick={editMode} />
                      }
                    </td>
                  </tr>
                  <tr style={{height: 70}}>
                    <td style={{paddingBottom: 25, fontWeight: 'bold'}}>First Name</td>
                    <td style={{verticalAlign: 'top'}}>
                      { isEditMode ?
                        <InputField id='rem-upr-frm-first_name' required type='text' field='first_name' value={userProfile.newData.first_name}
                            onChange={formFieldChangeUserProfile} errorMsg='First name is required.' width={200} style={{paddingRight: 10}} /> :
                        <div style={{paddingTop: 10}}>{userProfile.newData.first_name}</div>
                      }
                    </td>
                  </tr>
                  <tr style={{height: 70}}>
                    <td style={{paddingBottom: 25, fontWeight: 'bold'}}>Middle Name</td>
                    <td style={{verticalAlign: 'top'}}>
                    { isEditMode ?
                      <InputField id='rem-upr-frm-middle_name' type='text' field='middle_name' value={userProfile.newData.middle_name}
                          onChange={formFieldChangeUserProfile} errorMsg='Middle name is optional.' width={200} style={{paddingRight: 10}} /> :
                      <div style={{paddingTop: 10}}>{userProfile.newData.middle_name}</div>
                    }
                    </td>
                  </tr>
                  <tr style={{height: 70}}>
                    <td style={{paddingBottom: 25, fontWeight: 'bold'}}>Last Name</td>
                    <td style={{verticalAlign: 'top'}}>
                    { isEditMode ?
                      <InputField id='rem-upr-frm-last_name' required type='text' field='last_name' value={userProfile.newData.last_name}
                        onChange={formFieldChangeUserProfile} errorMsg='Last name is required.' width={200} style={{paddingRight: 10}} /> :
                      <div style={{paddingTop: 10}}>{userProfile.newData.last_name}</div>
                    }
                    </td>
                  </tr>
                  <tr>
                    <td style={{fontWeight: 'bold', paddingBottom: 10}}>Email</td>
                    <td style={{paddingBottom: 10}}>{session.user.email}</td>
                  </tr>
                  <tr>
                    <td style={{fontWeight: 'bold', paddingBottom: 10}}>Country</td>
                    <td style={{paddingBottom: 10}}>{session.country.name}</td>
                  </tr>
                </tbody>
              </table>

            </form>

            <hr />
            <div>
              <h3 style={{fontSize: '24px', marginBottom: 5}}>Roles and Permissions</h3>
              <div>
                { session.user.is_superuser && <div>User is a Super-User. User can add/edit countries.</div>}
                { session.user.is_admin && <div>User has access to Admin Section.</div>}
              </div>
              <div>
                {session.permissions.filter (p => p.indexOf('.') > -1).map ((p, idx) => <div key={idx}>{permissionMap(p)}</div>)}
              </div>
            </div>
            <hr />

            <div>
              <h3 style={{fontSize: '24px', marginBottom: 5}}>Projects</h3>
              <ul>
                { session.projects.map (p => <li key={p.code}>{p.name} ({p.code})</li>)}
              </ul>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default UserProfile;

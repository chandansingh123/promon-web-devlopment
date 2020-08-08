import React from 'react';

import InputField from 'components/Admin/Common/InputField';
import FlatButton from 'components/Common/FlatButton';


const PASSWORD_REGEX = /(?=.*\d)(?=.*[A-Z])(?=.{8,})/;


const UserPassword = ({userProfile, formFieldChangeUserProfile, updatePassword}) => (
  <div style={{paddingTop: 40, paddingLeft: 40}}>
    <form id='rem-upp-frm'>
      <table style={{borderSpacing: '20px 0', borderCollapse: 'separate'}}>
        <tbody>
          <tr style={{height: 70}}>
            <td style={{paddingBottom: 25, fontWeight: 'bold'}}>Original Password</td>
            <td style={{verticalAlign: 'top'}}>
              <InputField id='rem-upp-frm-original_password' required type='password' field='original_password' value={userProfile.newData.original_password}
                  onChange={formFieldChangeUserProfile} errorMsg='Original password is required.' width={200} style={{paddingRight: 10}} />
            </td>
          </tr>
          <tr style={{height: 70}}>
            <td style={{paddingBottom: 25, fontWeight: 'bold'}}>New Password</td>
            <td style={{verticalAlign: 'top'}}>
              <InputField id='rem-upp-frm-new_password' required type='password' field='new_password' value={userProfile.newData.new_password}
                  onChange={formFieldChangeUserProfile} width={200} style={{paddingRight: 10}} />
              { PASSWORD_REGEX.test(userProfile.newData.new_password) ||
                <div style={{color: '#d50000', position: 'absolute', fontSize: 10, marginTop: -12}}>
                  Password must be at least 8 characters long and must contain a number.
                </div>
              }
            </td>
          </tr>
          <tr style={{height: 70}}>
            <td style={{paddingBottom: 25, fontWeight: 'bold'}}>Confirm Password</td>
            <td style={{verticalAlign: 'top'}}>
              <InputField id='rem-upp-frm-confirm_password' required type='password' field='confirm_password' value={userProfile.newData.confirm_password}
                  onChange={formFieldChangeUserProfile} width={200} style={{paddingRight: 10}} />
              { userProfile.newData.new_password !== userProfile.newData.confirm_password &&
                <div style={{color: '#d50000', position: 'absolute', fontSize: 10, marginTop: -12}}>
                  The passwords must match.
                </div>
              }
            </td>
          </tr>
          <tr>
            <td></td>
            <td style={{textAlign: 'right', paddingBottom: 20, width: 210}}>
              <FlatButton id='rem-upp-frm-save' icon='save' label='Save' onClick={updatePassword} />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
);

export default UserPassword;

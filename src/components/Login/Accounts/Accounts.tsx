import React, {Dispatch, SetStateAction} from 'react';
import styles from "../../../pages/Login/login.module.scss";
import {authAPI} from "../../../services/AuthServices";
import {IAllUserAgent} from "../../../interfaces/IAllUserAgent";

interface PropsType {
  setIsShowAccounts: Dispatch<SetStateAction<boolean>>
  users: IAllUserAgent[] | undefined
  loginAgentFunc: (id: string) => void
}

const Accounts = ({setIsShowAccounts, users, loginAgentFunc}: PropsType) => {
  const [deleteAgent, {}] = authAPI.useDeleteAgentMutation();


  return (
    <div className={styles.acconts}>
      <h3>Login as</h3>
      {
        users && users.map(user=> (
          <div className={styles.acconts_body}>
            <div onClick={() => loginAgentFunc(user.user.id)}>
              <span>{ user.user.username }</span>
              { user.user.avatar_url ? <img src={user.user.avatar_url} alt="avatar"/> : <div>{user.user.username[0]}</div>}
            </div>
            <svg onClick={() => {deleteAgent({id: user.user.id})}} width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M20.5 6H3.49988" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5M18.8334 8.5L18.6334 11.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M9.5 11L10 16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M14.5 11L14 16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>

        ))
      }
      <button onClick={() => {setIsShowAccounts(false)}}>Login to another account</button>
    </div>
  );
};

export default Accounts;
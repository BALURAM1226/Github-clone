import React from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import firebase, {auth} from "../../Firebase/config";
import SignOut from '../SignOut';
import { useAuthState } from 'react-firebase-hooks/auth';
import {Link} from 'react-router-dom';
import './Navbar.css';
export default function Navbar(props){

  const[user] = useAuthState(auth);
  return(
    <>
<div className="Homepage_header">
   <Link to="/">
   <GitHubIcon className="github_icon"/>
   </Link>
   <SignOut/>
</div>
<div className="user_info">
   <img className="user_img" src={props.userpic} alt="user_pic"/>
   <div className = "user_names">
      <h3>{user.displayName}</h3>
      <h4 className="user_login_name">{props.username}</h4>
   </div>
</div>
</>
  )
}

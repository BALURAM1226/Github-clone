import React,{useState} from 'react';
import firebase, {auth} from "../Firebase/config";
import './Loginpage.css';
import { useHistory } from 'react-router-dom';
import GitHubIcon from '@material-ui/icons/GitHub';
import { useAuthState } from "react-firebase-hooks/auth";


export default function React({githubSignIn}){

  const [username,setUserName] = useState("");
  const[user]= useAuthState(auth);
var provider = new firebase.auth.GithubAuthProvider();

const history = useHistory();

  return(
    <>
    <div className="Login_page">
    <div className="page_name">
     <h1>welcome to Login Page</h1>
    </div>

    <div className="signIn_btn_div">

    <span className="signIn_btn" onClick={githubSignIn}>
      SignIn With Github
     <GitHubIcon className="github_logo" />
     </span>
    </div>
    </div>
 
    </>

  )
}

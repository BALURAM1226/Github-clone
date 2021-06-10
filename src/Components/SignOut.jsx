
import React from 'react';
import { useHistory } from 'react-router-dom';
import './SignOut.css';
import firebase, {auth} from "../Firebase/config";

export default function SignOut(){

const history = useHistory();

  const githubSignOut = () => {
    window.localStorage.clear();

    firebase.auth().signOut()
    .then((signout) =>{
      alert("SignOut successfully");
      history.push('/')
    }).catch((error)=>{
      console.log(error)
    })
    
  }
  return (
    <>
    <div className="signOut_btn">
    <span  onClick={githubSignOut}>SignOut</span>
    </div>
    </>
  )
}
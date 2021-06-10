import React,{useState, useEffect} from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import ReposData from '../reposData/ReposData';
import firebase, {auth} from "../../Firebase/config";
import { Link, useHistory } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loginpage from '../Loginpage';
import SignOut from '../SignOut';

export default function Homepage(){
    const[user] = useAuthState(auth);
  const [username,setUserName] = useState(
    window.localStorage.getItem('login')
  );
  const[userPic, setUserPic] = useState(
    window.localStorage.getItem('userpic')
  );
  
  useEffect(()=>{
    window.localStorage.setItem('login',username);
    window.localStorage.setItem('userpic',userPic);
  },[username,userPic])

  var provider = new firebase.auth.GithubAuthProvider();
   
   const githubSignIn = () => {

    firebase.auth().signInWithPopup(provider)
    .then((result)=> {
      setUserPic(result.additionalUserInfo.profile.avatar_url)

      setUserName(result.additionalUserInfo.profile.login)
  
    }).catch((error)=>{
      console.log(error);
    })
}
  

  return(
    <>
{   user ?
<div>
   <Navbar 
      username={username} 
      userpic={userPic}
      />
   <ReposData username={username} />
</div>
:
<div>
   <Loginpage githubSignIn={githubSignIn} />
</div>
}
</>
}
